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
    <v-dialog v-model="dialog" max-width="500px">
      <v-card style="width: 500px; height: auto; border-radius: 15px">
        <v-card-title
          class="d-flex justify-content-between px-4 mb-3 align-items-center"
          style="background-color: #386568; color: #ffffff"
        >
          <h5 class="mt-2">Users</h5>
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
                  v-model="name"
                  label="Name"
                  density="comfortable"
                  class="textfield"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="12" class="py-0">
                <v-text-field
                  v-model="email"
                  label="Email"
                  density="comfortable"
                  class="textfield"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="12" class="py-0">
                <v-text-field
                  v-model="password"
                  label="Password"
                  density="comfortable"
                  type="password"
                  class="textfield"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="12" class="py-0">
                <v-select
                  v-model="rolename"
                  :items="roles"
                  label="Role"
                  class="textfield"
                  density="comfortable"
                  :single-line="name"
                  item-title="name"
                  variant="outlined"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="12" md="12" class="py-0">
                <v-select
                  v-model="status"
                  :items="['Active', 'Inactive']"
                  label="Status"
                  density="comfortable"
                  class="textfield"
                  variant="outlined"
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
    <v-data-table
      :headers="headers"
      :items="filteredUsers"
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
          <v-btn color="primary" @click="openModal">Add User</v-btn>
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
                <v-text-field
                  v-model="item.email"
                  outlined
                  dense
                  :rules="[(value) => !!value || 'email is required']"
                  class="d-flex justify-content-center"
                ></v-text-field
              ></v-form>
            </template>
            <template v-else>
              <p class="my-0">{{ item.email }}</p>
            </template>
          </td>
          <td class="text-center">
            <template v-if="isEditing(index) && !dialogDelete">
              <v-form v-model="form">
                <v-select
                  v-model="item.rolename"
                  :items="roles"
                  label="Role"
                  class="textfield"
                  density="comfortable"
                  :single-line="name"
                  item-title="name"
                  variant="outlined"
                ></v-select
              ></v-form>
            </template>
            <template v-else>
              <p class="my-0">{{ item.role }}</p>
            </template>
          </td>
          <td class="text-center">
            <template v-if="isEditing(index) && !dialogDelete">
              <v-select
                v-model="item.status"
                :items="['Active', 'Inactive']"
                density="comfortable"
                outlined
              ></v-select>
            </template>
            <template v-else>
              <p :style="{ color: item.status === 'Active' ? 'green' : 'red' }">
                {{ item.status }}
              </p>
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
                @click="deleteUser(item.id)"
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
    <UserModal v-if="showModal" @close="closeModal" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      headers: [
        { title: "Sl No", sortable: false, align: "center" },
        { title: "Name", key: "name", align: "center" },
        { title: "Email", key: "email", align: "center" },
        { title: "Role", key: "role", align: "center" },
        { title: "Status", key: "status", align: "center" },
        {
          title: "Actions",
          value: "actions",
          sortable: false,
          align: "center",
        },
      ],
      dialog: false,
      name: "",
      email: "",
      rolename: "",
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
      password: "",
    };
  },
  computed: {
    ...mapGetters(["getUsers", "getRoles"]),
    users() {
      return this.getUsers;
    },
    roles() {
      return this.getRoles;
    },
    filteredUsers() {
      if (!this.search) return this.users;
      const query = this.search.toLowerCase();
      return this.users.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.role.toLowerCase().includes(query)
      );
    },
  },
  methods: {
    ...mapActions(["fetchUsers", "deleteUser", "fetchRoles", "updateUser"]),
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
    editUser() {
      this.dialogEdit = true;
    },
    async removeUser(id) {
      await this.deleteUser(id);
    },
    async add() {
      const user = {
        name: this.name,
        email: this.email,
        password: this.password,
        role: this.rolename,
        status: this.status || "Active",
      };
      try {
        const res = await this.$store.dispatch("addUser", user);
        console.log("response", res);
        if (res) {
          this.message = "User successfully added";
          this.name = "";
          this.email = "";
          this.rolename = "";
          this.status = "";
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
        const user = {
          name: item.name,
          email: item.email,
          role: item.rolename,
          status: item.status,
        };
        const res = await this.$store.dispatch("updateUser", {
          id: id,
          user: user,
        });
        if (res) {
          setTimeout(() => {
            this.loading = false;
            this.message = "User updated Successfully!";
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
    this.fetchUsers();
    this.fetchRoles();
  },
};
</script>
