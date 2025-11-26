import { ref, computed } from 'vue'

export const useSearch = (items: any[], searchFields: string[]) => {
  const searchQuery = ref('')

  const searchResults = computed(() => {
    if (!searchQuery.value) return items

    const query = searchQuery.value.toLowerCase()
    return items.filter((item) => {
      return searchFields.some((field) => {
        const value = String(item[field]).toLowerCase()
        return value.includes(query)
      })
    })
  })

  const setSearchQuery = (query: string) => {
    searchQuery.value = query
  }

  const clearSearch = () => {
    searchQuery.value = ''
  }

  return {
    searchQuery,
    searchResults,
    setSearchQuery,
    clearSearch,
  }
}
