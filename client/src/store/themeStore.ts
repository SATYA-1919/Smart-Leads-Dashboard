import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  toggle: () => void;
  setTheme: (theme: Theme) => void;
}

function readInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  const stored = localStorage.getItem('theme') as Theme | null;
  if (stored === 'dark' || stored === 'light') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  if (theme === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
  localStorage.setItem('theme', theme);
}

export const useThemeStore = create<ThemeState>((set, get) => {
  const initial = readInitialTheme();
  if (typeof window !== 'undefined') applyTheme(initial);
  return {
    theme: initial,
    toggle: () => {
      const next = get().theme === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      set({ theme: next });
    },
    setTheme: (theme) => {
      applyTheme(theme);
      set({ theme });
    },
  };
});
