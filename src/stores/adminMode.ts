import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRole } from '~/composables/useRole'

// 30 minutes in milliseconds
const ADMIN_IDLE_TIMEOUT = 30 * 60 * 1000

export const useAdminModeStore = defineStore('adminMode', () => {
  const {
    isAdmin,
    isSuperAdmin,
    isManager,
    isDharamshalaManager,
    isTirthManager,
    userRole,
    managerDharamshalaId,
  } = useRole()

  const isAdminMode  = ref(false)
  const showAuthModal = ref(false)

  // Idle timeout internals — not reactive (no need to observe)
  let idleTimer:        ReturnType<typeof setTimeout>  | null = null
  let activityCleanup: (() => void) | null = null

  // ── Idle timeout ──────────────────────────────────────────────
  const resetIdleTimer = () => {
    if (!isAdminMode.value) return
    if (idleTimer) clearTimeout(idleTimer)
    idleTimer = setTimeout(() => {
      // Session timed out — exit admin mode silently
      _exitAdminMode()
      // Optional: show a toast here via a global event bus
      console.warn('[AdminMode] Session expired due to inactivity.')
    }, ADMIN_IDLE_TIMEOUT)
  }

  const startActivityTracking = () => {
    if (typeof window === 'undefined') return
    const events   = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart']
    const handler  = () => resetIdleTimer()
    events.forEach(e =>
      document.addEventListener(e, handler, { passive: true })
    )
    activityCleanup = () =>
      events.forEach(e => document.removeEventListener(e, handler))
    resetIdleTimer()
  }

  const stopActivityTracking = () => {
    if (activityCleanup) {
      activityCleanup()
      activityCleanup = null
    }
    if (idleTimer) {
      clearTimeout(idleTimer)
      idleTimer = null
    }
  }

  // ── Core actions ──────────────────────────────────────────────

  // Internal exit — does not require auth
  const _exitAdminMode = () => {
    isAdminMode.value = false
    stopActivityTracking()
  }

  // Public entry — always requires password verification first
  const requestAdminMode = () => {
    if (!isAdmin.value) return
    showAuthModal.value = true
  }

  // Called by AdminAuthModal on successful password verification
  const confirmAdminEntry = () => {
    showAuthModal.value = false
    isAdminMode.value   = true
    startActivityTracking()
  }

  // Called when modal is dismissed
  const cancelAdminEntry = () => {
    showAuthModal.value = false
  }

  // Public exit
  const exitAdminMode = () => {
    _exitAdminMode()
  }

  // Legacy compat — used by init-auth plugin on sign out
  // (sign out always exits admin mode without auth)
  const toggleAdminMode = () => {
    if (isAdminMode.value) {
      _exitAdminMode()
    } else {
      requestAdminMode()
    }
  }

  // ── Computed ──────────────────────────────────────────────────

  const canAccessAdmin  = computed(() => isAdmin.value)
  const isSuperAdminVal = computed(() => isSuperAdmin.value)

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

  return {
    // State
    isAdminMode,
    showAuthModal,
    // Role
    canAccessAdmin,
    adminLabel,
    propertyLabel,
    isSuperAdmin:         isSuperAdminVal,
    isTirthManager,
    isDharamshalaManager,
    managerDharamshalaId,
    userRole,
    // Actions
    requestAdminMode,
    confirmAdminEntry,
    cancelAdminEntry,
    exitAdminMode,
    toggleAdminMode,
  }
})
