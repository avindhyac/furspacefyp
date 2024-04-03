import { getAuth, onAuthStateChanged } from "firebase/auth";

const routes = [
  { path: "/", component: () => import("pages/PageLogin.vue") }, // Set login page as home screen
  {
    path: "/home",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "/camera", component: () => import("pages/PageCamera.vue") },
      { path: "/profile", component: () => import("pages/PageProfile.vue") },
      { path: "/", component: () => import("pages/PageHome.vue") },
    ],
  },
  { path: "/signup", component: () => import("pages/PageSignup.vue") },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
