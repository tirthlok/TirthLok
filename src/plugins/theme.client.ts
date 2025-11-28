export default defineNuxtPlugin(() => {
  const themeStore = useThemeStore()
  
  // Only run on client side
  if (process.client) {
    themeStore.loadTheme()
  }
})
