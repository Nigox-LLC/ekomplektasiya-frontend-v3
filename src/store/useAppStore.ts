import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  pageTitle: string;
  setPageTitle: (title: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      isLoading: false,
      setLoading: (loading) => set({ isLoading: loading }),
      pageTitle: '',
      setPageTitle: (title) => set({ pageTitle: title }),
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({ theme: state.theme }), // Only persist theme
    }
  )
);
