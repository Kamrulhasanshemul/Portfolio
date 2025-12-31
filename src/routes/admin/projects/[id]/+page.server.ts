
import { error, redirect } from '@sveltejs/kit';
import { supabase } from '$lib/supabase';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
    if (!locals.user) throw error(401, 'Unauthorized');

    const { id } = params;

    // Handle "new" - return empty template
    if (id === 'new') {
        return {
            project: {
                title: '',
                slug: '',
                short_description: '',
                full_description: '',
                status: 'draft',
                category: 'data-analytics',
                technologies: [],
                key_features: [],
                challenges_solved: [],
                results_achieved: [],
                images: [],
                videos: []
            }
        };
    }

    // Fetch existing
    const { data: project, error: err } = await supabase
        .from('project_details')
        .select('*')
        .eq('id', id)
        .single();

    if (err || !project) {
        throw error(404, 'Project not found');
    }

    return { project };
};

export const actions: Actions = {
    default: async ({ request, params, locals }) => {
        if (!locals.user) throw error(401, 'Unauthorized');

        const { id } = params;
        const formData = await request.formData();

        // Extract basic fields
        const title = formData.get('title') as string;
        const slug = formData.get('slug') as string;
        const short_description = formData.get('short_description') as string;
        const category = formData.get('category') as string;
        const status = formData.get('status') as string;
        const project_date = formData.get('project_date') as string;
        const featured_image = formData.get('featured_image') as string;
        const live_demo_url = formData.get('live_demo_url') as string;
        const github_url = formData.get('github_url') as string;

        // Complex fields are sent as JSON strings because standard FormData is flat
        // The client-side will JSON.stringify these arrays before submitting
        const full_description = formData.get('full_description') as string;
        const technologies = JSON.parse(formData.get('technologies') as string || '[]');
        const key_features = JSON.parse(formData.get('key_features') as string || '[]');
        const challenges_solved = JSON.parse(formData.get('challenges_solved') as string || '[]');
        const results_achieved = JSON.parse(formData.get('results_achieved') as string || '[]');
        const images = JSON.parse(formData.get('images') as string || '[]');
        const videos = JSON.parse(formData.get('videos') as string || '[]');

        const payload = {
            title,
            slug,
            short_description,
            full_description,
            category,
            status,
            project_date: project_date || null,
            featured_image,
            live_demo_url,
            github_url,
            technologies,
            key_features,
            challenges_solved,
            results_achieved,
            images,
            videos,
            updated_at: new Date().toISOString()
        };

        let error;

        if (id === 'new') {
            const { error: insertError } = await supabase
                .from('project_details')
                .insert(payload);
            error = insertError;
        } else {
            const { error: updateError } = await supabase
                .from('project_details')
                .update(payload)
                .eq('id', id);
            error = updateError;
        }

        if (error) {
            console.error('Project Save Error:', error);
            return { success: false, error: error.message };
        }

        // If new, redirect to list
        if (id === 'new') {
            throw redirect(303, '/admin/projects');
        }

        return { success: true };
    }
};
