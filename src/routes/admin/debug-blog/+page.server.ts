
import { supabase } from '$lib/supabase';
import { ENV } from '$lib/env';

export const load = async () => {
    let debugInfo = {
        envUrl: ENV.SUPABASE_URL ? 'Defined' : 'Undefined',
        urlValue: ENV.SUPABASE_URL, // Temporarily showing for debug (be careful)
        envKey: ENV.SUPABASE_KEY ? 'Defined' : 'Undefined',
        connection: 'Pending',
        tableCheck: 'Pending',
        sampleData: [],
        error: null
    };

    try {
        // 1. Check Connection & Table
        const { count, error: countError } = await supabase
            .from('blog_posts')
            .select('*', { count: 'exact', head: true });

        if (countError) {
            debugInfo.connection = 'Failed';
            debugInfo.error = countError;
        } else {
            debugInfo.connection = 'Success';
            debugInfo.tableCheck = `Found ${count} posts`;
        }

        // 2. Fetch Sample
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
