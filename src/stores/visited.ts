import { defineStore } from 'pinia'

export const useVisitedStore = defineStore('visited', {
  state: () => ({
    visitedIds: [] as string[],
  }),
  actions: {
    add(id: string) {
      if (!this.visitedIds.includes(id)) {
        this.visitedIds.push(id)
      }
    },
    remove(id: string) {
      const idx = this.visitedIds.indexOf(id)
      if (idx > -1) {
        this.visitedIds.splice(idx, 1)
      }
    },
    toggle(id: string) {
      if (this.visitedIds.includes(id)) this.remove(id)
      else this.add(id)
    },
    isVisited(id: string) {
      return this.visitedIds.includes(id)
    },
  },
})
