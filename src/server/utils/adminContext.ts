import type { H3Event } from 'h3'
import { getHeader } from 'h3'

export interface AdminContext {
  userId:        string
  userRole:      string
  managerType:   string | null
  tirthId:       string | null
  dharamshalaId: string | null
  isSuperAdmin:  boolean
  isManager:     boolean
}

export function getAdminContext(event: H3Event): AdminContext | null {
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader?.startsWith('Bearer ')) return null

  try {
    const token   = authHeader.substring(7)
    const payload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString()
    )
    return {
      userId:        payload.sub,
      userRole:      payload.user_role      || 'customer',
      managerType:   payload.manager_type   || null,
      tirthId:       payload.tirth_id       || null,
      dharamshalaId: payload.dharamshala_id || null,
      isSuperAdmin:  payload.user_role === 'super_admin',
      isManager:     payload.user_role === 'manager',
    }
  } catch {
    return null
  }
}

export function requireAdmin(event: H3Event): AdminContext {
  const ctx = getAdminContext(event)
  if (!ctx || (!ctx.isSuperAdmin && !ctx.isManager)) {
    throw createError({ statusCode: 403, statusMessage: 'Admin access required' })
  }
  return ctx
}

export function requireSuperAdmin(event: H3Event): AdminContext {
  const ctx = getAdminContext(event)
  if (!ctx || !ctx.isSuperAdmin) {
    throw createError({ statusCode: 403, statusMessage: 'Super admin access required' })
  }
  return ctx
}
