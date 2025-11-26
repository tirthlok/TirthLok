import { ref, computed } from 'vue'

export const usePagination = <T,>(items: T[], pageSize = 12) => {
  const currentPage = ref(1)

  const totalPages = computed(() => Math.ceil(items.length / pageSize))

  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    return items.slice(start, start + pageSize)
  })

  const goToPage = (page: number) => {
    currentPage.value = Math.max(1, Math.min(page, totalPages.value))
  }

  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++
    }
  }

  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--
    }
  }

  return {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
    nextPage,
    prevPage,
  }
}
