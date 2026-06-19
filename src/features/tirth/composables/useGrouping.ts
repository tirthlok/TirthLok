import type { Tirth } from '~/types/models'

export interface GroupedTirths {
  grouping: string
  tirths: Tirth[]
  count: number
  displayTitle: string
}

/**
 * Composable for grouping tirths by tirth_grouping field.
 * Fully generic and reusable for any grouping field.
 */
export function useGrouping() {
  /**
   * Format grouping value to readable title
   * E.g., 'popular-temples' → 'Popular Temples'
   * E.g., '108 Parshvanath' → '108 Parshvanath'
   */
  const formatGroupingTitle = (value: string): string => {
    // If already has spaces or special formatting, return as-is
    if (value.includes(' ') || /\d/.test(value)) {
      return value
    }
    
    // Otherwise, convert kebab-case to Title Case
    return value
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  /**
   * Extract unique tirth_grouping values from array of Tirths
   * Maintains order of first appearance
   */
  const getUniqueGroupings = (tirths: Tirth[]): string[] => {
    const groupings = new Map<string, boolean>()
    
    tirths.forEach(tirth => {
      if (tirth.tirth_grouping) {
        // Handle both string and array (future-proof)
        const values = Array.isArray(tirth.tirth_grouping)
          ? tirth.tirth_grouping
          : [tirth.tirth_grouping]
        
        values.forEach(value => {
          if (value && !groupings.has(value)) {
            groupings.set(value, true)
          }
        })
      }
    })
    
    return Array.from(groupings.keys())
  }

  /**
   * Group tirths by their tirth_grouping value
   * Returns array of GroupedTirths in order of appearance
   */
  const groupTirthsByGrouping = (tirths: Tirth[]): GroupedTirths[] => {
    const uniqueGroupings = getUniqueGroupings(tirths)
    
    return uniqueGroupings
      .map(grouping => ({
        grouping,
        tirths: tirths.filter(tirth => {
          if (!tirth.tirth_grouping) return false
          
          const values = Array.isArray(tirth.tirth_grouping)
            ? tirth.tirth_grouping
            : [tirth.tirth_grouping]
          
          return values.includes(grouping)
        }),
        count: 0, // Will be computed
        displayTitle: formatGroupingTitle(grouping)
      }))
      .map(group => ({
        ...group,
        count: group.tirths.length
      }))
      .filter(group => group.count > 0) // Remove empty groups
  }

  return {
    getUniqueGroupings,
    groupTirthsByGrouping,
    formatGroupingTitle
  }
}
