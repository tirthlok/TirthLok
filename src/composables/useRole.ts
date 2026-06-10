import { computed } from 'vue'
import { useAuth } from '~/features/auth/composables/useAuth'

export const useRole = () => {
  const { session } = useAuth()

  const jwtPayload = computed(() => {
    try {
      const token = session.value?.access_token
      if (!token) return {}
      return JSON.parse(atob(token.split('.')[1]))
    } catch {
      return {}
    }
  })

  const userRole          = computed(() => jwtPayload.value?.user_role || 'customer')
  const managerType       = computed(() => jwtPayload.value?.manager_type || null)
  const managerDharamshalaId = computed(() => jwtPayload.value?.dharamshala_id || null)
  const managerTirthId    = computed(() => jwtPayload.value?.tirth_id || null)

  const isAdmin      = computed(() =>
    userRole.value === 'super_admin' || userRole.value === 'manager'
  )
  const isSuperAdmin = computed(() => userRole.value === 'super_admin')
  const isManager    = computed(() => userRole.value === 'manager')

  const isDharamshalaManager = computed(() =>
    isManager.value &&
    (managerType.value === 'dharamshala' || managerType.value === 'both')
  )
  const isTirthManager = computed(() =>
    isManager.value &&
    (managerType.value === 'tirth' || managerType.value === 'both')
  )

  return {
    userRole,
    managerType,
    managerDharamshalaId,
    managerTirthId,
    isAdmin,
    isSuperAdmin,
    isManager,
    isDharamshalaManager,
    isTirthManager,
  }
}
