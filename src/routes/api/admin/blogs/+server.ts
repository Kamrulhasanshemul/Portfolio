import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabaseAdmin } from '$lib/server/supabase';

export const GET: RequestHandler = async ({ url }) => {
    try {
        const category = url.searchParams.get('category');
        const status = url.searchParams.get('status');
        const limit = parseInt(url.searchParams.get('limit') || '50');
        const offset = parseInt(url.searchParams.get('offset') || '0');

        let query = supabaseAdmin
            .from('blog_posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (category) {
            query = query.eq('category', category);
        }

        if (status) {
            query = query.eq('status', status);
        }

        query = query.range(offset, offset + limit - 1);

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching admin blog posts:', error);
            return json({ success: false, error: error.message }, { status: 500 });
        }

        return json({ success: true, data });
    } catch (error) {
        console.error('Error in admin blogs endpoint:', error);
        return json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
};
