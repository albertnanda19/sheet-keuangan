import { create } from "zustand";
import { PeriodFilter } from "@/types";

interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
}

interface UIState {
  sidebarOpen: boolean;
  quickActionOpen: boolean;
  periodFilter: PeriodFilter;
  customDateRange: { start: string; end: string } | null;
  notifications: Notification[];
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleQuickAction: () => void;
  setPeriodFilter: (filter: PeriodFilter) => void;
  setCustomDateRange: (range: { start: string; end: string } | null) => void;
  addNotification: (
    type: Notification["type"],
    message: string
  ) => void;
  removeNotification: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  quickActionOpen: false,
  periodFilter: "this_month",
  customDateRange: null,
  notifications: [],

  toggleSidebar: () =>
    set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleQuickAction: () =>
    set((state) => ({ quickActionOpen: !state.quickActionOpen })),
  setPeriodFilter: (filter) => set({ periodFilter: filter }),
  setCustomDateRange: (range) => set({ customDateRange: range }),

  addNotification: (type, message) => {
    const id = crypto.randomUUID();
    set((state) => ({
      notifications: [...state.notifications, { id, type, message }],
    }));
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    }, 5000);
  },

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));
