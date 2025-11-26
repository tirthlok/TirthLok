export default defineNuxtPlugin(() => {
  // Global error handler (client-only)
  if (typeof window !== 'undefined') {
    window.addEventListener('error', (event) => {
      console.error('Global error:', (event as any).error)
    })
  }
})
