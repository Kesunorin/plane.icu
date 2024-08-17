import { createRouter, createWebHistory } from "vue-router";
import Home from "/src/components/Main.vue";
import RaidTier from "/src/components/RaidTier.vue";
import ERaidTier from "/src/components/ERaidTier.vue";
import RaidAnalysis from "/src/components/RaidAnalysis.vue";
// import rank1 from "/src/components/rank1.vue";
import About from "/src/components/About.vue";
import friendSearch from "/src/components/FriendSearch.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/raidTier", component: RaidTier },
  { path: "/eraidTier", component: ERaidTier },
  { path: "/raidAnalysis", component: RaidAnalysis },
  // { path: "/rank1", component: rank1 },
  { path: "/About", component: About },
  { path: "/friendSearch", component: friendSearch },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
