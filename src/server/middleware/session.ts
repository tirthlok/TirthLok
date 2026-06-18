import { createServerClient } from '@supabase/ssr'
import { getCookie, setCookie, deleteCookie, getHeader } from 'h3'

export default defineEventHandler(async (event) => {
  const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) return

  // Performance optimisation: skip entirely if no Supabase cookie exists.
  // Avoids creating a server client on every public request
  // (tirth listing, dharamshala listing, bhojanshala listing, etc.)
  const cookieHeader = getHeader(event, 'cookie') ?? ''
  if (!cookieHeader.includes('sb-')) {
    event.context.accessToken = null
    event.context.session     = null
    return
  }

  // Per-request server Supabase client.
  // Reads the HttpOnly cookie, refreshes the token if expired,
  // and writes the updated cookie back to the response.
  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      get: (name) => getCookie(event, name),

      set: (name, value, options) => {
        setCookie(event, name, value, {
          maxAge:   options?.maxAge,     // SerializeOptions (cookie pkg) uses maxAge (seconds)
          domain:   options?.domain,
          path:     options?.path     ?? '/',
          sameSite: (options?.sameSite as 'lax' | 'strict' | 'none') ?? 'lax',
          httpOnly: true,               // Critical — JS cannot read this cookie
          secure:   process.env.NODE_ENV === 'production', // HTTPS only in prod
        })
      },

      remove: (name, options) => {
        deleteCookie(event, name, {
          domain: options?.domain,
          path:   options?.path ?? '/',
        })
      },
    },
  })

  // getSession() reads and parses the cookie locally — no network call.
  // Its only purpose here is to extract the raw access_token.
  // This is NOT the security verification step.
  // getUserIdFromEvent() calls getUser(token) which makes a network
  // call to Supabase Auth server to verify the token before trusting it.
  const { data: { session } } = await supabase.auth.getSession()

  event.context.accessToken = session?.access_token ?? null
  event.context.session     = session               ?? null
})
