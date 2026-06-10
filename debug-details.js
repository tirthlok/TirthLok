import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL || process.env.NUXT_PUBLIC_SUPABASE_URL || "https://cfmvkvpyjvbcenqorifa.supabase.co"
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || ""

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    db: { schema: 'tirthlok' }
})

async function test() {
    console.log('Querying tirth_cards...');
    const { data: card, error: e1 } = await supabase.from('tirth_cards').select('*').eq('tirth_id', 'TL-GJ-0001').single();
    if (e1) console.error(e1);
    else console.log('tirth_cards columns:', Object.keys(card));
    
    console.log('Querying tirth_details...');
    const { data: detail, error: e2 } = await supabase.from('tirth_details').select('*').eq('tirth_id', 'TL-GJ-0001').single();
    if (e2) console.error(e2);
    else {
        console.log('tirth_details columns:', Object.keys(detail));
        console.log('tirth_details data:', JSON.stringify(detail, null, 2));
    }
}

test();
