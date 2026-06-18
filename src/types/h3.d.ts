import type { Session } from '@supabase/supabase-js'

// Extends H3EventContext so TypeScript knows about the properties
// set by server/middleware/session.ts on every request.
// Must live at the types level so all server files —
// supabase.ts, adminContext.ts, and every API route —
// see the correct types for event.context.accessToken
// and event.context.session.
declare module 'h3' {
  interface H3EventContext {
    accessToken: string | null
    session:     Session | null
  }
}
