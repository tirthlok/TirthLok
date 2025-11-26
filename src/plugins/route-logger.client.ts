export default defineNuxtPlugin(() => {
  const router = useRouter()

  router.beforeEach((to, from) => {
    console.debug('[route-logger] beforeEach', {
      to: to.fullPath,
      from: from.fullPath,
      params: to.params,
    })
    return true
  })

  router.afterEach((to, from) => {
    console.debug('[route-logger] afterEach', {
      to: to.fullPath,
      from: from.fullPath,
      params: to.params,
      matchedNames: to.matched.map((m) => m.name),
    })

    try {
      const matchedComponents = to.matched.map((r) => ({
        name: r.name,
        components: Object.keys((r.components || {}) as Record<string, unknown>),
      }))
      console.debug('[route-logger] matchedComponents', matchedComponents)
    } catch (e) {
      console.debug('[route-logger] matchedComponents error', e)
    }

    try {
      const resolved = router.resolve(to)
      console.debug('[route-logger] resolved', resolved)
    } catch (e) {
      console.debug('[route-logger] resolve error', e)
    }
  })
})
