import { getSupabaseTirthlok } from '../utils/supabase'

export default defineEventHandler(async () => {
    const supabase = getSupabaseTirthlok()
    const { data, error } = await supabase.rpc('get_columns', { table_name: 'customer_wishlist' }).catch(() => ({ data: null, error: null }))
    
    // Fallback: fetch 1 row
    const { data: rows, error: rowsError } = await supabase.from('customer_wishlist').select('*').limit(1)

    return {
        rows,
        rowsError
    }
})
