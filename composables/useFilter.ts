import { ref, computed } from 'vue'

export const useFilter = <T extends Record<string, any>>(items: T[], filterKeys: (keyof T)[]) => {
  const filters = ref<Record<string, string>>({})

  const filteredItems = computed(() => {
    return items.filter((item) => {
      return filterKeys.every((key) => {
        const filterValue = filters.value[String(key)]
        if (!filterValue) return true
        return String(item[key]).toLowerCase().includes(filterValue.toLowerCase())
      })
    })
  })

  const setFilter = (key: string, value: string) => {
    filters.value[key] = value
  }

  const resetFilters = () => {
    filters.value = {}
  }

  return {
    filters,
    filteredItems,
    setFilter,
    resetFilters,
  }
}
