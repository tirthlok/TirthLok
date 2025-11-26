/**
 * useCard Composable
 * Handles card navigation and interaction logic
 */

import { useRouter } from 'vue-router'
import type { CardItem } from '../types'

export function useCard(item: CardItem) {
  const router = useRouter()

  /**
   * Navigate to detail page based on card type
   * Routes: /tirth/:id, /dharamshala/:id, /bhojanshala/:id
   */
  const navigateToDetail = (routePrefix: string) => {
    router.push(`${routePrefix}/${item.id}`)
  }

  /**
   * Handle card click - prevents navigation if clicking interactive elements
   */
  const handleCardClick = (event: MouseEvent, routePrefix: string) => {
    const target = event.target as HTMLElement
    const clickedButton = target.closest('button')
    const clickedLink = target.closest('a')

    if (!clickedButton && !clickedLink) {
      navigateToDetail(routePrefix)
    }
  }

  return {
    navigateToDetail,
    handleCardClick,
  }
}
