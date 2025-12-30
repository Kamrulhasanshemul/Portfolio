import { supabase } from '$lib/supabase';
import { supabaseAdmin } from '$lib/server/supabase';
import { ENV } from '$lib/env';
import { env } from '$env/dynamic/private';

export const load = async () => {
    let debugInfo = {
        envUrl: ENV.SUPABASE_URL ? 'Defined' : 'Undefined',
        urlValue: ENV.SUPABASE_URL,
        envKey: ENV.SUPABASE_KEY ? 'Defined' : 'Undefined',
        serviceKeyAvailable: !!env.SUPABASE_SERVICE_ROLE_KEY,
        connection: 'Pending',
        adminConnection: 'Pending',
        tableCheck: 'Pending',
        sampleData: [],
        adminSampleData: [],
        error: null
    };

    try {
        // 1. Check Public Client (Anon)
        const { count, error: countError } = await supabase
            .from('blog_posts')
            .select('*', { count: 'exact', head: true });

        if (countError) {
            debugInfo.connection = `Failed (Anon): ${countError.message}`;
        } else {
            debugInfo.connection = `Success (Public): Found ${count}`;
        }

        // 2. Check Admin Client (Service Role)
        if (env.SUPABASE_SERVICE_ROLE_KEY) {
            const { data: adminData, error: adminError } = await supabaseAdmin
                .from('blog_posts')
                .select('title, status')
                .limit(3);

            if (adminError) {
                debugInfo.adminConnection = `Failed (Admin): ${adminError.message}`;
            } else {
                debugInfo.adminConnection = `Success (Admin): Fetched ${adminData?.length} rows`;
                debugInfo.adminSampleData = adminData || [];
            }
        } else {
            debugInfo.adminConnection = 'Skipped (No Key)';
        }

        // 3. Fetch Sample (Public)
        const { data, error: fetchError } = await supabase
            .from('blog_posts')
            .select('slug, title, status')
            .limit(5);

        if (fetchError) {
            debugInfo.error = debugInfo.error || fetchError;
        } else {
            debugInfo.sampleData = data || [];
        }

    } catch (e) {
        debugInfo.error = e;
    }

    return { debugInfo };
};
