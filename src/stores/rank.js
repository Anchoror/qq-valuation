import { defineStore } from "pinia";

export const useRankStore = defineStore(
  "rank",
  () => {
    const rank = ref([]);
    return { rank };
  },
  {
    persist: {
      paths: ["rank"],
    },
  },
);
