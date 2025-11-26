/**
 * useApi Composable
 * Unified API interface - delegates to entity-specific composables
 * @deprecated Use specific composables instead: useTirthApi, useDharamshalaApi, useBhojanshalAApi, useFavoriteApi
 */

import { useTirthApi } from './useTirthApi'
import { useDharamshalaApi } from './useDharamshalaApi'
import { useBhojanshalAApi } from './useBhojanshalAApi'
import { useFavoriteApi } from './useFavoriteApi'

export const useApi = () => {
  const { fetchTirths, fetchTirthById, createTirth, updateTirth, deleteTirth } = useTirthApi()
  const { fetchDharamshalas, fetchDharamshalaById } = useDharamshalaApi()
  const { fetchBhojanshallas, fetchBhojanshalAById } = useBhojanshalAApi()
  const { fetchFavorites, addFavorite, removeFavorite } = useFavoriteApi()

  return {
    // Tirth API
    fetchTirths,
    fetchTirthById,
    createTirth,
    updateTirth,
    deleteTirth,

    // Dharamshala API
    fetchDharamshalas,
    fetchDharamshalaById,

    // Bhojanshala API
    fetchBhojanshallas,
    fetchBhojanshalAById,

    // Favorites API
    fetchFavorites,
    addFavorite,
    removeFavorite,
  }
}
