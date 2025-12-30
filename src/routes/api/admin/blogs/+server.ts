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
            .select('id, title, slug, status, category, created_at, updated_at, views, published_at, featured_image, author')
            .order('created_at', { ascending: false });

        if (category) {
            query = query.eq('category', category);
        }

        if (status) {
            query = query.eq('status', status);
        }

        query = query.range(offset, offset + limit - 1);

        console.log('Admin Blogs API: Request params:', { category, status, limit, offset });

        // Debug: Check if key is actually being used in this context
        // We can't easily check the internal key of the client, but we can check the env again if needed, 
        // though that might be redundant. Trusting the client for now but logging queries.

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching admin blog posts:', error);
            return json({ success: false, error: error.message }, { status: 500 });
        }

        console.log(`Admin Blogs API: Fetched ${data?.length} rows`);
        if (data?.length === 0) {
            console.log('Admin Blogs API: Warning - 0 rows returned. Check RLS or filters.');
        }

        return json({ success: true, data }, {
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate'
            }
        });
    } catch (error) {
        console.error('Error in admin blogs endpoint:', error);
        return json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
};
