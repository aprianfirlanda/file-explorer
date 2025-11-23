import { createRouter, createWebHistory } from "vue-router";
import ExplorerLayout from "../components/layout/ExplorerLayout.vue";

const routes = [
  {
    path: "/explorer",
    name: "explorer",
    component: ExplorerLayout,
    props: (route: any) => ({
      folderId: route.query.folderId || null,
    }),
  },

  { path: "/", redirect: "/explorer" },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
