import { ref, computed } from 'vue'

export const useTabNavigation = (tabs: { id: string; label: string }[]) => {
  const activeTab = ref(tabs[0]?.id || '')

  const activeTabLabel = computed(
    () => tabs.find((t) => t.id === activeTab.value)?.label || ''
  )

  const setActiveTab = (tabId: string) => {
    const exists = tabs.find((t) => t.id === tabId)
    if (exists) {
      activeTab.value = tabId
    }
  }

  return {
    activeTab,
    activeTabLabel,
    setActiveTab,
  }
}
