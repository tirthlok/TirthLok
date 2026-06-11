import { requireSuperAdmin } from '~/server/utils/adminContext'
import { getSupabaseTirthlok } from '~/server/utils/supabase'
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  await requireSuperAdmin(event)

  const body = await readBody(event)
  const {
    email, full_name, phone,
    manager_type,
    assigned_tirth_id,
    assigned_dharamshala_id,
  } = body

  if (!email || !full_name || !manager_type) {
    throw createError({
      statusCode: 400,
      statusMessage: 'email, full_name and manager_type are required',
    })
  }

  // Use service role client for admin auth operations
  const adminClient = createClient(
    process.env.NUXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  // Invite user by email
  const { data: inviteData, error: inviteError } = await adminClient
    .auth.admin.inviteUserByEmail(email, {
      data: { full_name },
    })

  if (inviteError) {
    // User might already exist
    if (!inviteError.message.includes('already')) {
      throw createError({
        statusCode: 400,
        statusMessage: inviteError.message,
      })
    }
    // Use direct REST endpoint to find user by email
    // avoids loading ALL users into memory
    const lookupRes = await fetch(
      `${process.env.NUXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/users?` +
      new URLSearchParams({ email }),
      {
        headers: {
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
          'apikey': `${process.env.SUPABASE_SERVICE_KEY}`,
        }
      }
    )
    const lookupData = await lookupRes.json()
    const existing = lookupData?.users?.[0]

    if (!existing) {
      throw createError({
        statusCode: 404,
        statusMessage: 'No account found with this email. User must sign up first.'
      })
    }
    inviteData.user = existing as any
  }

  const userId = inviteData?.user?.id
  if (!userId) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to get user ID' })
  }

  // Create manager profile
  const supabase = getSupabaseTirthlok()
  const { data: profile, error: profileError } = await (supabase
    .from('manager_profiles') as any)
    .upsert({
      manager_id:              userId,
      full_name,
      phone:                   phone || null,
      manager_type,
      assigned_tirth_id:       assigned_tirth_id       || null,
      assigned_dharamshala_id: assigned_dharamshala_id || null,
      is_active:               true,
    }, { onConflict: 'manager_id' })
    .select()
    .single()

  if (profileError) {
    throw createError({
      statusCode: 500,
      statusMessage: profileError.message,
    })
  }

  return { success: true, manager: profile }
})
