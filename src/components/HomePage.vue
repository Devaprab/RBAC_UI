<template>
  <v-app id="inspire">
    <v-app-bar flat v-if="isLoggedIn">
      <v-container class="mx-auto d-flex align-center justify-center">
        <v-avatar class="me-4" color="grey-darken-1" size="42">R</v-avatar>

        <v-btn
          v-for="link in links"
          :key="link"
          :text="link.text"
          :value="link.route"
          @click.prevent="navigate({ name: link.routeName })"
          variant="text"
        ></v-btn>

        <v-spacer></v-spacer>
        <v-responsive max-width="160">
          <v-btn class="mx-2" color="danger" @click="logout">Logout</v-btn>
        </v-responsive>
      </v-container>
    </v-app-bar>

    <v-main class="bg-teal-lighten-4" v-if="isLoggedIn">
      <v-container>
        <v-row>
          <v-col cols="2">
            <v-sheet rounded="lg">
              <v-list rounded="lg">
                <v-list-item
                  v-for="sideBar in sideBars"
                  :key="sideBar"
                  :title="sideBar.text"
                  :value="sideBar.route"
                  @click.prevent="navigate({ name: sideBar.routeName })"
                  link
                ></v-list-item>
              </v-list>
            </v-sheet>
          </v-col>

          <v-col>
            <v-sheet min-height="70vh" rounded="lg">
              <router-view></router-view>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["isLoggedIn"]),
    links: () => [
      { text: "Profile", route: "/rbac-admin/profile", routeName: "profile" },
    ],
    sideBars: () => [
      { text: "Users", route: "/rbac-admin/users", routeName: "UserPage" },
      {
        text: "Permissions",
        route: "/rbac-admin/permission",
        routeName: "Permission",
      },
      { text: "Roles", route: "/rbac-admin/roles", routeName: "Roles" },
    ],
  },
  methods: {
    ...mapActions("logout"),
    navigate(route) {
      this.$router.push(route);
    },
    logout() {
      this.$store.dispatch("logout");
      this.$router.push({ name: "Login" });
    },
  },
};
</script>
