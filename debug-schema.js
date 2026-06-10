import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL || process.env.NUXT_PUBLIC_SUPABASE_URL || "https://cfmvkvpyjvbcenqorifa.supabase.co"
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || ""

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function test() {
    const { data, error } = await supabase.from('information_schema.columns').select('table_name, column_name').eq('table_schema', 'tirthlok');
    if (error) console.error(error);
    else {
        const tables = {};
        data.forEach(row => {
            if (!tables[row.table_name]) tables[row.table_name] = [];
            tables[row.table_name].push(row.column_name);
        });
        console.log(JSON.stringify(tables, null, 2));
    }
}

test();
