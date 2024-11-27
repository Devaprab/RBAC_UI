import { createRouter, createWebHistory } from "vue-router";
import store from "@/store";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/rbac-admin/",
      alias: "/",
      name: "Login",
      component: () => import("@/pages/LoginPage.vue"),
    },
    {
      path: "/rbac-admin/home",
      name: "Home",
      component: () => import("@/components/HomePage.vue"),
      meta: { requiresAuth: true, adminOnly: true },
      children: [
        {
          path: "/rbac-admin/users",
          name: "UserPage",
          alias: "/",
          component: () => import("@/pages/UserPage.vue"),
          meta: { requiresAuth: true, adminOnly: true },
        },
        {
          path: "/rbac-admin/permission",
          name: "Permission",
          component: () => import("@/pages/PermissionPage.vue"),
          meta: { requiresAuth: true, adminOnly: true },
        },
        {
          path: "/rbac-admin/roles",
          name: "Roles",
          component: () => import("@/pages/RolePage.vue"),
          meta: { requiresAuth: true, adminOnly: true },
        },
        {
          path: "/rbac-admin/profile",
          name: "profile",
          component: () => import("@/pages/ProfilePage.vue"),
          meta: { requiresAuth: true, adminOnly: true },
        },
      ],
    },
    {
      path: "/rbac-admin/forbidden",
      name: "Forbidden",
      component: () => import("@/pages/ForbiddenPage.vue"),
    },
    {
      path: "/rbac-admin/:pathMatch(.*)*",
      redirect: "/rbac-admin/forbidden",
    }
  ],
});

// Route Protection
router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters.isAuthenticated;
  const isAdmin = store.getters.isAdmin;

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({ name: "Login" });
    } else if (to.matched.some((record) => record.meta.adminOnly) && !isAdmin) {
      next({ name: "Forbidden" });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
