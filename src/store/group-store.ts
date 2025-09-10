import { create } from "zustand";
import type { Group } from "@/types/group-types";

interface GroupStore {
  group: Group | null;
  setGroup: (group: Group) => void;
  resetGroup: () => void;
}

export const useGroupStore = create<GroupStore>((set) => ({
  group: null,
  setGroup: (group) => set({ group }),
  resetGroup: () => set({ group: null }),
}));
