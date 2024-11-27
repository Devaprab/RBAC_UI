<template>
  <div>
    <v-snackbar
      v-model="snackbar"
      :color="color"
      :timeout="timeout"
      location="top"
    >
      <div class="text-center">{{ message }}</div>
    </v-snackbar>
    <!-- dialog to add role -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card style="width: 500px; height: auto; border-radius: 15px">
        <v-card-title
          class="d-flex justify-content-between px-4 mb-3 align-items-center"
          style="background-color: #386568; color: #ffffff"
        >
          <h5 class="mt-2">Permissions</h5>
          <v-icon
            @click="close"
            class="mdi mdi-window-close"
            size="24"
          ></v-icon>
        </v-card-title>
        <v-card-text class="py-0">
          <v-container class="pb-1">
            <v-row>
              <v-col cols="12" sm="12" md="12" class="py-0">
                <v-text-field
                  v-model="role"
                  label="Role"
                  density="comfortable"
                  class="textfield"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="12" class="py-0">
                <v-select
                  v-model="permissionname"
                  :items="permissions"
                  label="Permission"
                  class="textfield"
                  density="comfortable"
                  :single-line="action"
                  item-title="action"
                  variant="outlined"
                  multiple
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions class="mb-4 mx-4">
          <v-btn
            color="#546E7A"
            variant="elevated"
            block
            style="text-transform: capitalize"
            elevation="4"
            size="large"
            @click="add()"
            class="mb-2"
          >
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- table to display role -->
    <v-data-table
      :headers="headers"
      :items="filteredRoles"
      items-per-page="5"
      class="elevation-1"
      item-value="id"
      max-width="100%"
      color="grey-darken-3"
      :header-props="{ style: 'background-color: #386568; color: white;' }"
      height="300"
      fixed-header
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-responsive max-width="160">
            <v-text-field
              class="mx-2"
              v-model="search"
              prepend-inner-icon="mdi mdi-magnify"
              density="compact"
              label="Search"
              rounded="lg"
              variant="solo-filled"
              flat
              hide-details
              single-line
            ></v-text-field>
          </v-responsive>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="openModal">Add Role</v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item="{ item, index }">
        <tr style="background-color: #fcfdf6; color: black">
          <td class="text-center">{{ index + 1 }}</td>
          <td class="text-center">
            <template v-if="isEditing(index) && !dialogDelete">
              <v-form v-model="form">
                <v-text-field
                  v-model="item.name"
                  outlined
                  dense
                  :rules="[(value) => !!value || 'name is required']"
                  class="d-flex justify-content-center"
                ></v-text-field
              ></v-form>
            </template>
            <template v-else>
              <p class="my-0">{{ item.name }}</p>
            </template>
          </td>
          <td class="text-center">
            <template v-if="isEditing(index) && !dialogDelete">
              <v-form v-model="form">
                <v-select
                  v-model="permissionname"
                  :items="permissions"
                  label="Permission"
                  class="textfield"
                  density="comfortable"
                  :single-line="action"
                  item-title="action"
                  variant="outlined"
                  multiple
                ></v-select
              ></v-form>
            </template>
            <template v-else>
              <p class="my-0">{{ item.permissions }}</p>
            </template>
          </td>
          <td class="text-center">
            <div v-if="!isEditing(index) || dialogDelete">
              <v-icon
                size="default"
                color="teal-darken-3"
                class="mdi mdi-pencil"
                @click="startEditing(index)"
              ></v-icon>
              <v-icon
                @click="deleteRoles(item.id)"
                :loading="loading"
                size="default"
                color="danger"
                class="mdi mdi-trash-can ms-4"
                :disabled="loading"
                >Submit</v-icon
              >
            </div>

            <div
              v-else-if="isEditing(index) && !dialogDelete"
              class="d-flex gap-1 justify-content-center"
            >
              <v-btn
                size="x-small"
                color="#2E7D32"
                @click="editItem(item)"
                :loading="loading"
                :disabled="loading"
                >Submit</v-btn
              >
              <v-btn size="x-small" color="#2E7D32" @click="editingIndex = null"
                >Cancel</v-btn
              >
            </div>
          </td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  data() {
    return {
      headers: [
        { title: "Sl No", sortable: false, align: "center" },
        { title: "Roles", key: "name", align: "center" },
        { title: "Permissions", key: "permission", align: "center" },
        {
          title: "Actions",
          value: "actions",
          sortable: false,
          align: "center",
        },
      ],
      dialog: false,
      role: "",
      permissionname: [],
      snackbar: false,
      color: "#E8F5E9",
      timeout: 3000,
      message: "",
      search: "",
      form: false,
      editButton: false,
      editingIndex: null,
      editedItem: null,
      loading: false,
    };
  },
  computed: {
    ...mapGetters(["getPermissions", "getRoles"]),
    permissions() {
      return this.getPermissions;
    },
    roles() {
      return this.getRoles;
    },
    filteredRoles() {
      if (!this.search) return this.roles;
      const searchLower = this.search.toLowerCase();
      return this.roles.filter((roles) =>
        roles.name.toLowerCase().includes(searchLower)
      );
    },
  },
  methods: {
    ...mapActions(["deleteRoles", "fetchRoles", "fetchPermissions"]),
    isEditing(index) {
      return this.editingIndex === index;
    },
    startEditing(index) {
      this.editingIndex = index;
    },
    openModal() {
      this.dialog = true;
    },
    close() {
      this.dialog = false;
    },
    editRole(user) {
      console.log("Edit user", user);
    },
    async removeRoles(id) {
      await this.deleteRoles(id);
    },
    async add() {
      const roles = {
        name: this.role,
        permissions: this.permissionname,
      };
      try {
        const res = await this.$store.dispatch("addRoles", roles);
        console.log("response", res);
        if (res) {
          this.message = "Role successfully added";
          this.name = "";
          this.snackbar = true;
          this.dialog = false;
        }
      } catch (error) {
        console.error(error);
      }
    },
    async editItem(item) {
      if (!this.form) return;
      try {
        this.loading = true;
        const id = item.id;
        const role = {
          name: item.name,
          permissions: this.permissionname,
        };
        const res = await this.$store.dispatch("updateRole", {
          id: id,
          role: role,
        });
        if (res) {
          setTimeout(() => {
            this.loading = false;
            this.message = "Price updated Successfully!";
            this.snackbar = true;
            this.editingIndex = null;
          }, 2000);
        }
      } catch (err) {
        this.loading = false;
        this.message = "edit not completed";
        this.color = "red";
        this.snackbar = true;
      }
    },
  },
  created() {
    this.fetchRoles();
    this.fetchPermissions();
  },
};
</script>
