import { requireSuperAdmin } from '~/server/utils/adminContext'
import { getSupabaseTirthlok } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  await requireSuperAdmin(event)

  const managerId = getRouterParam(event, 'id')
  if (!managerId) {
    throw createError({ statusCode: 400, statusMessage: 'Manager ID required' })
  }

  const supabase = getSupabaseTirthlok() as any

  const { error } = await supabase
    .from('manager_profiles')
    .delete()
    .eq('manager_id', managerId)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'Delete failed' })
  }

  return { success: true }
})
