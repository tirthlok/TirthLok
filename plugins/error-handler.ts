export default defineNuxtPlugin(() => {
  // Global error handler
  if (process.client) {
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error)
    })
  }
})
