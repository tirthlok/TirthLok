import { requireSuperAdmin } from '~/server/utils/adminContext'
import { getSupabaseTirthlok } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  await requireSuperAdmin(event)
  const supabase = getSupabaseTirthlok()

  const { data, error } = await supabase
    .from('manager_profiles')
    .select(`
      manager_id, full_name, phone, manager_type,
      is_active, created_at,
      tirth:assigned_tirth_id (tirth_id, tirth_name),
      dharamshala:assigned_dharamshala_id (
        dharamshala_id, dharamshala_name
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch managers' })
  }
  return data || []
})
