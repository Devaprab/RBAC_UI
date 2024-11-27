<template>
  <v-container v-if="getLogin" class="profile-container pt-5">
    <v-card class="profile-card">
      <v-card-title>
        <h2 class="profile-title">Profile</h2>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="profile-label"
                    >Name:</v-list-item-title
                  >
                  <v-list-item-subtitle class="profile-value">{{
                    getLogin.name
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="profile-label"
                    >Email:</v-list-item-title
                  >
                  <v-list-item-subtitle class="profile-value">{{
                    getLogin.email
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="profile-label"
                    >Role:</v-list-item-title
                  >
                  <v-list-item-subtitle class="profile-value">{{
                    getLogin.role
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
  <v-container v-else>
    <p>Loading profile...</p>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["getLogin"]),
  },
};
</script>

<style scoped>
.profile-container {
  padding: 2rem;
  display: flex;
  justify-content: center;
}

.profile-card {
  max-width: 600px;
  width: 100%;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
}

.profile-title {
  text-align: center;
  color: #333;
  font-weight: bold;
}

.profile-label {
  font-size: 1rem;
  font-weight: 500;
  color: #555;
}

.profile-value {
  font-size: 1rem;
  color: #333;
}

.v-list-item {
  margin-bottom: 1rem;
}

.v-list-item-title {
  font-weight: bold;
}

.v-list-item-subtitle {
  color: #555;
}
</style>
