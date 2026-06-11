import { getSupabaseTirthlok } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const query   = getQuery(event)
  const page    = Math.max(1, Number(query.page  || 1))
  const limit   = Math.min(50, Math.max(1, Number(query.limit || 12)))
  const offset  = (page - 1) * limit
  const state   = query.state as string | undefined
  const type    = query.type  as string | undefined
  const tirth   = query.tirth as string | undefined
  const search  = query.search as string | undefined

  // Validate type if provided
  const validTypes = ['free', 'paid', 'donation']
  if (type && !validTypes.includes(type)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid bhojanshala type' })
  }

  const supabase = getSupabaseTirthlok() as any

  let dbQuery = supabase
    .from('bhojanshala_cards')
    .select(`
      bhojanshala_id,
      tirth_id,
      bhojanshala_name,
      bhojanshala_city,
      bhojanshala_state,
      bhojanshala_images,
      bhojanshala_type,
      tags,
      tirth:tirth_id (tirth_name)
    `, { count: 'exact' })
    .eq('is_active', true)
    .order('bhojanshala_name')
    .range(offset, offset + limit - 1)

  if (state)  dbQuery = dbQuery.eq('bhojanshala_state', state)
  if (type)   dbQuery = dbQuery.eq('bhojanshala_type', type)
  if (tirth)  dbQuery = dbQuery.eq('tirth_id', tirth)
  if (search) dbQuery = dbQuery.ilike('bhojanshala_name', `%${search}%`)

  const { data, error, count } = await dbQuery

  if (error) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch bhojanshalas' })
  }

  return {
    bhojanshalas: data || [],
    total:        count  || 0,
    page,
    limit,
  }
})
