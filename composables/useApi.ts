export const useApi = () => {
  const config = useRuntimeConfig()

  const fetchTirths = async () => {
    try {
      return await $fetch('/api/tirths', {
        baseURL: config.public.apiBaseUrl,
      })
    } catch (error) {
      console.error('Error fetching tirths:', error)
      throw error
    }
  }

  const fetchTirthById = async (id: string) => {
    try {
      return await $fetch(`/api/tirths/${id}`, {
        baseURL: config.public.apiBaseUrl,
      })
    } catch (error) {
      console.error(`Error fetching tirth ${id}:`, error)
      throw error
    }
  }

  const createTirth = async (data: any) => {
    try {
      return await $fetch('/api/tirths', {
        method: 'POST',
        baseURL: config.public.apiBaseUrl,
        body: data,
      })
    } catch (error) {
      console.error('Error creating tirth:', error)
      throw error
    }
  }

  const updateTirth = async (id: string, data: any) => {
    try {
      return await $fetch(`/api/tirths/${id}`, {
        method: 'PUT',
        baseURL: config.public.apiBaseUrl,
        body: data,
      })
    } catch (error) {
      console.error(`Error updating tirth ${id}:`, error)
      throw error
    }
  }

  const deleteTirth = async (id: string) => {
    try {
      return await $fetch(`/api/tirths/${id}`, {
        method: 'DELETE',
        baseURL: config.public.apiBaseUrl,
      })
    } catch (error) {
      console.error(`Error deleting tirth ${id}:`, error)
      throw error
    }
  }

  return {
    fetchTirths,
    fetchTirthById,
    createTirth,
    updateTirth,
    deleteTirth,
  }
}
