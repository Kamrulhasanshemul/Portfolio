
import { error } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    // Ensure admin is logged in (middleware usually handles this, but good to be safe)
    if (!locals.user) {
        throw error(401, 'Unauthorized');
    }

    const { data: projects, error: err } = await supabase
        .from('project_details')
        .select('id, title, slug, status, category, project_date')
        .order('project_date', { ascending: false });

    if (err) {
        console.error('Error fetching projects:', err);
        return { projects: [] };
    }

    return { projects };
};
