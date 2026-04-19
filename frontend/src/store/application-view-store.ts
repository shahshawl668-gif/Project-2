"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { ApplicationView } from "@/types/job-tracker";

interface ApplicationViewState {
  view: ApplicationView;
  setView: (view: ApplicationView) => void;
}

export const useApplicationViewStore = create<ApplicationViewState>()(
  persist(
    (set) => ({
      view: "table",
      setView: (view) => set({ view }),
    }),
    {
      name: "jobtracker-application-view",
    },
  ),
);
