
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Try to load .env.local first, then .env
const envResult = dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
if (envResult.error) {
    dotenv.config({ path: path.resolve(process.cwd(), '.env') });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Key in environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    console.log('--- Test 3: Fetch all projects (limit 1) ---');
    const { data: projects, error } = await supabase
        .from('projects')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Test 3 failed:', JSON.stringify(error, null, 2));
    } else {
        console.log('Test 3 success. Count:', projects ? projects.length : 0);
        if (projects && projects.length > 0) {
            console.log('Project sample:', JSON.stringify(projects[0], null, 2));
        }
    }
}

run().catch(console.error);
