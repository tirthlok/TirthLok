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
   * For tirth cards, use item.name (tirth_name) instead of item.id
   * Routes: /tirth/{name}, /dharamshala/:id, /bhojanshala/:id
   */
  const navigateToDetail = (routePrefix: string) => {
    // Use item.name for tirth routing, item.id for others
    const identifier = routePrefix === '/tirth' ? encodeURIComponent(item.name) : item.id
    const targetRoute = `${routePrefix}/${identifier}`
    
    // Use router.push for reliable navigation
    router.push(targetRoute)
  }

  /**
   * Handle card click - prevents navigation if clicking interactive elements
   */
  const handleCardClick = (event: MouseEvent, routePrefix: string) => {
    // More robust check: look through composedPath for interactive elements
    try {
      const path = (event.composedPath && event.composedPath()) || (event as any).path || []
      const clickedInteractive = path.some((node: any) => {
        if (!node || !node.tagName) return false
        const tag = String(node.tagName).toUpperCase()
        if (tag === 'BUTTON' || tag === 'A') return true
        // data attribute to explicitly opt-out of navigation
        if (node.dataset && node.dataset.noNav === 'true') return true
        // role=button
        if (node.getAttribute && node.getAttribute('role') === 'button') return true
        return false
      })

      if (!clickedInteractive) navigateToDetail(routePrefix)
    } catch (e) {
      // Fallback to original logic if composedPath isn't available or errors
      const target = event.target as HTMLElement
      const clickedButton = target.closest && target.closest('button')
      const clickedLink = target.closest && target.closest('a')
      if (!clickedButton && !clickedLink) navigateToDetail(routePrefix)
    }
  }

  return {
    navigateToDetail,
    handleCardClick,
  }
}
