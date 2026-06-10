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
            if (process.client) {
                localStorage.setItem('appTheme', newTheme)
            }
        },

        toggleTheme() {
            const newTheme = this.theme === 'light' ? 'dark' : 'light'
            this.setTheme(newTheme)
        },

        loadTheme() {
            if (process.client) {
                const saved = localStorage.getItem('appTheme') as ThemeType | null
                if (saved && (saved === 'light' || saved === 'dark')) {
                    this.theme = saved
                    this.applyTheme(saved)
                } else {
                    // Default to light theme
                    this.theme = 'light'
                    this.applyTheme('light')
                }
            }
        },

        applyTheme(theme: ThemeType) {
            if (process.client) {
                const html = document.documentElement
                if (theme === 'dark') {
                    html.classList.add('dark')
                } else {
                    html.classList.remove('dark')
                }
            }
        },
    },
})
