import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRole } from '~/composables/useRole'

export const useAdminModeStore = defineStore('adminMode', () => {
  const isAdminMode = ref(false)
  const { isAdmin, isSuperAdmin, userRole,
          managerDharamshalaId } = useRole()

  const canAccessAdmin = computed(() => isAdmin.value)

  const adminLabel = computed(() => {
    if (isSuperAdmin.value) return 'Super Admin'
    if (managerDharamshalaId.value) return 'Property Manager'
    return 'Manager'
  })

  const propertyLabel = computed(() => {
    if (isSuperAdmin.value) return 'Super Admin — All Properties'
    if (managerDharamshalaId.value) return `Managing: ${managerDharamshalaId.value}`
    return 'Manager'
  })

  const isSuperAdminVal = computed(() => isSuperAdmin.value)

  const toggleAdminMode = () => {
    if (!canAccessAdmin.value) return
    isAdminMode.value = !isAdminMode.value
  }

  const enterAdminMode = () => {
    if (!canAccessAdmin.value) return
    isAdminMode.value = true
  }

  const exitAdminMode = () => {
    isAdminMode.value = false
  }

  return {
    isAdminMode,
    canAccessAdmin,
    adminLabel,
    propertyLabel,
    isSuperAdmin: isSuperAdminVal,
    userRole,
    toggleAdminMode,
    enterAdminMode,
    exitAdminMode,
  }
})
