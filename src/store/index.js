import { createStore } from "vuex";
import axios from "axios";

const API_URL = "http://localhost:3000";

const store = createStore({
  state: {
    users: JSON.parse(sessionStorage.getItem("users")) || [],
    roles: JSON.parse(sessionStorage.getItem("roles")) || [],
    permissions: JSON.parse(sessionStorage.getItem("permissions")) || [],
    loggedInUser: JSON.parse(sessionStorage.getItem("user")) || [],
    loggedIn: false,
  },
  mutations: {
    SET_USERS(state, users) {
      state.users = users;
      sessionStorage.setItem("users", JSON.stringify(users));
    },
    SET_ROLES(state, roles) {
      state.roles = roles;
      sessionStorage.setItem("roles", JSON.stringify(roles));
    },
    SET_PERMISSIONS(state, permissions) {
      state.permissions = permissions;
      sessionStorage.setItem("permissions", JSON.stringify(permissions));
    },
    SET_LOGGED_IN_USER(state, user) {
      state.loggedIn = true;
      state.loggedInUser = user;
      sessionStorage.setItem("user", JSON.stringify(user));
    },
    LOGOUT(state) {
      state.loggedIn = false;
    },
  },
  actions: {
    async fetchUsers({ commit }) {
      try {
        const response = await axios.get(`${API_URL}/users`);
        commit("SET_USERS", response.data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    },
    async fetchRoles({ commit }) {
      try {
        const response = await axios.get(`${API_URL}/roles`);
        commit("SET_ROLES", response.data);
      } catch (error) {
        console.error("Failed to fetch roles:", error);
      }
    },
    async deleteRoles({ dispatch }, id) {
      await axios.delete(`${API_URL}/roles/${id}`);
      dispatch("fetchRoles");
    },
    async addRoles({ dispatch }, roles) {
      const res = await axios.post(`${API_URL}/roles`, roles);
      if (res.status >= 200 && res.status < 300) {
        dispatch("fetchRoles");
        return true;
      }
    },
    async updateRole({ dispatch }, { id, role }) {
      const res = await axios.put(`${API_URL}/roles/${id}`, role);
      if (res.status >= 200 && res.status < 300) {
        dispatch("fetchRoles");
        return true;
      }
    },
    async fetchPermissions({ commit }) {
      try {
        const response = await axios.get(`${API_URL}/permissions`);
        commit("SET_PERMISSIONS", response.data);
      } catch (error) {
        console.error("Failed to fetch permissions:", error);
      }
    },
    async addPermission({ dispatch }, permissions) {
      const res = await axios.post(`${API_URL}/permissions`, permissions);
      if (res.status >= 200 && res.status < 300) {
        dispatch("fetchPermissions");
        return true;
      }
    },
    async updatePermission({ dispatch }, { id, permission }) {
      const res = await axios.put(`${API_URL}/permissions/${id}`, permission);
      if (res.status >= 200 && res.status < 300) {
        dispatch("fetchPermissions");
        return true;
      }
    },
    async deletePermission({ dispatch }, id) {
      await axios.delete(`${API_URL}/permissions/${id}`);
      dispatch("fetchPermissions");
    },
    async addUser({ dispatch }, user) {
      try {
        const res = await axios.post(`${API_URL}/users`, user);
        if (res.status >= 200 && res.status < 300) {
          dispatch("fetchUsers");
          return true;
        }
      } catch (error) {
        console.error("Failed to add user:", error);
        return false;
      }
    },
    async updateUser({ dispatch }, { id, user }) {
      const res = await axios.put(`${API_URL}/users/${id}`, user);
      if (res.status >= 200 && res.status < 300) {
        dispatch("fetchUsers");
        return true;
      }
    },
    async deleteUser({ dispatch }, id) {
      await axios.delete(`${API_URL}/users/${id}`);
      dispatch("fetchUsers");
    },
    async login({ commit }, { email, password }) {
      try {
        const response = await axios.get(
          `${API_URL}/users?email=${email}&password=${password}`
        );
        if (response.data.length > 0) {
          console.log("Login successful, user found:", response.data[0]);
          commit("SET_LOGGED_IN_USER", response.data[0]);
          return true;
        } else {
          console.log("Login failed: Invalid email or password");
          throw new Error("Invalid email or password");
        }
      } catch (error) {
        console.error("Login error:", error);
        return false;
      }
    },

    logout({ commit }) {
      commit("SET_LOGGED_IN_USER", null);
      commit("LOGOUT");
    },
  },
  getters: {
    getUsers: (state) => state.users,
    getRoles: (state) => state.roles,
    getPermissions: (state) => state.permissions,
    isAdmin: (state) => state.loggedInUser?.role === "Admin",
    isAuthenticated: (state) => !!state.loggedInUser,
    isLoggedIn: (state) => state.loggedIn,
    getLogin: (state) => state.loggedInUser,
  },
});

export default store;
