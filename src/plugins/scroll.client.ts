export default defineNuxtPlugin(() => {
  const router = useRouter()
  router.afterEach(() => {
    // Ensure we only run in the browser and schedule on next frame for smoothness
    if (typeof window !== 'undefined') {
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      })
    }
  })
})
