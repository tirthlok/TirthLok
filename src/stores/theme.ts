import { defineStore } from 'pinia'

export type ThemeType = 'light' | 'dark'

interface ThemeState {
  theme: ThemeType
}

export const useThemeStore = defineStore('theme', {
  state: (): ThemeState => ({
    theme: 'light' as ThemeType,
  }),

  getters: {
    getTheme: (state) => state.theme,
    isDarkMode: (state) => state.theme === 'dark',
    isLightMode: (state) => state.theme === 'light',
  },

  actions: {
    setTheme(newTheme: ThemeType) {
      this.theme = newTheme
      // Apply theme to document
      this.applyTheme(newTheme)
      // Persist to localStorage
      localStorage.setItem('appTheme', newTheme)
    },

    toggleTheme() {
      const newTheme = this.theme === 'light' ? 'dark' : 'light'
      this.setTheme(newTheme)
    },

    loadTheme() {
      const saved = localStorage.getItem('appTheme') as ThemeType | null
      if (saved && (saved === 'light' || saved === 'dark')) {
        this.theme = saved
        this.applyTheme(saved)
      } else {
        // Default to light theme
        this.theme = 'light'
      }
    },

    applyTheme(theme: ThemeType) {
      const html = document.documentElement
      if (theme === 'dark') {
        html.classList.add('dark')
      } else {
        html.classList.remove('dark')
      }
    },
  },
})
