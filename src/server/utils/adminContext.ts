import type { H3Event } from 'h3'
import { getHeader } from 'h3'
import { getSupabaseAdmin, getSupabaseTirthlok } from './supabase'

export interface AdminContext {
  userId:        string
  userRole:      string
  managerType:   string | null
  tirthId:       string | null
  dharamshalaId: string | null
  isSuperAdmin:  boolean
  isManager:     boolean
}

/**
 * SECURE: Verifies JWT signature via Supabase BEFORE reading claims.
 * Never trust JWT payload without signature verification.
 */
export async function getAdminContext(
  event: H3Event
): Promise<AdminContext | null> {
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader?.startsWith('Bearer ')) return null

  const token = authHeader.substring(7)

  // Step 1: Verify signature — rejects tampered tokens
  const supabase = getSupabaseAdmin()
  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) return null

  // Step 2: Only now is it safe to read the payload
  // The payload we read is the same one Supabase verified above
  let payload: Record<string, any> = {}
  try {
    payload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString()
    )
  } catch {
    return null
  }

  const userRole = payload.user_role || 'customer'

  // Step 3: Double-check super_admin against database
  // JWT claims can be stale — verify against source of truth
  if (userRole === 'super_admin') {
    const db = getSupabaseTirthlok() as any
    const { data: adminRecord } = await db
      .from('super_admins')
      .select('admin_id')
      .eq('admin_id', user.id)
      .eq('is_active', true)
      .maybeSingle()

    if (!adminRecord) return null // JWT says admin but DB says no
  }

  // Step 4: Double-check manager against database
  if (userRole === 'manager') {
    const db = getSupabaseTirthlok() as any
    const { data: managerRecord } = await db
      .from('manager_profiles')
      .select('manager_id, is_active')
      .eq('manager_id', user.id)
      .eq('is_active', true)
      .maybeSingle()

    if (!managerRecord) return null // JWT says manager but DB says no
  }

  return {
    userId:        user.id,
    userRole,
    managerType:   payload.manager_type   || null,
    tirthId:       payload.tirth_id       || null,
    dharamshalaId: payload.dharamshala_id || null,
    isSuperAdmin:  userRole === 'super_admin',
    isManager:     userRole === 'manager',
  }
}

export async function requireAdmin(event: H3Event): Promise<AdminContext> {
  const ctx = await getAdminContext(event)
  if (!ctx || (!ctx.isSuperAdmin && !ctx.isManager)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Admin access required'
    })
  }
  return ctx
}

export async function requireSuperAdmin(event: H3Event): Promise<AdminContext> {
  const ctx = await getAdminContext(event)
  if (!ctx || !ctx.isSuperAdmin) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Super admin access required'
    })
  }
  return ctx
}
