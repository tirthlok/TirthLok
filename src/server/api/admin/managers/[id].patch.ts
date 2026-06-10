import { requireSuperAdmin } from '~/server/utils/adminContext'
import { getSupabaseTirthlok } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  requireSuperAdmin(event)
  const managerId = getRouterParam(event, 'id')
  const body      = await readBody(event)
  const supabase  = getSupabaseTirthlok()

  const allowed = [
    'full_name', 'phone', 'manager_type',
    'assigned_tirth_id', 'assigned_dharamshala_id', 'is_active',
  ]
  const update: Record<string, any> = {}
  for (const key of allowed) {
    if (body[key] !== undefined) update[key] = body[key]
  }

  const { data, error } = await (supabase
    .from('manager_profiles') as any)
    .update(update)
    .eq('manager_id', managerId)
    .select()
    .single()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'Update failed' })
  }
  return data
})
