export default defineNuxtPlugin(() => {
  // Global error handler
  if (process.client) {
    window.addEventListener('error', () => {
      // Handle errors silently
    })
  }
})
