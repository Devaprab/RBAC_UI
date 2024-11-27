<template>
    <v-container class="d-flex align-center justify-center">
      <v-card class="pa-5" outlined>
        <v-card-title class="headline">Access Denied</v-card-title>
        <v-card-text>
          You do not have permission to access this page.
        </v-card-text>
        <v-btn @click="$router.push('/rbac-admin/')" color="primary">Go to Home</v-btn>
      </v-card>
    </v-container>
  </template>
  
  <script>
  export default {
    name: 'ForbiddenPage',
  };
  </script>
  