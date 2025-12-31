import { error, redirect } from '@sveltejs/kit';
import { supabase, ContentService } from '$lib/supabase';
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
        // Handle boolean checkbox/switch
        const is_featured = formData.get('is_featured') === 'true' || formData.get('is_featured') === 'on';
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
            is_featured,
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
            // We need to fetch the inserted ID/Slug to sync correctly if we want to be precise, 
            // but for now, let's just redirect. The user can edit again to sync if needed, 
            // OR we do the sync here. Let's do the sync here for better UX.
        }

        // --- SYNC WITH MAIN SITE JSON (portfolio_content) ---
        try {
            // 1. Fetch current content
            const { data: currentContent } = await ContentService.getContent();

            if (currentContent) {
                let projects = currentContent.projects || [];
                const projectIndex = projects.findIndex((p: any) =>
                    // Try to match by title (fuzzy) or if we had an ID. 
                    // Since JSON doesn't have IDs, we rely on title matching or slug generation.
                    // This is imperfect but standard for this hybrid setup.
                    p.title === title ||
                    p.title.toLowerCase().replace(/[^a-z0-9]/g, '-') === slug
                );

                const newProjectEntry = {
                    title: title,
                    description: short_description,
                    technologies: technologies,
                    impact: results_achieved[0]?.description || 'Impact pending...', // Map first result to impact
                    link: live_demo_url || `/projects/${slug}`, // Prefer live link, else internal
                    image: featured_image
                };

                if (projectIndex >= 0) {
                    // Update existing
                    projects[projectIndex] = newProjectEntry;
                } else {
                    // Add new (prepend to show as latest)
                    projects.unshift(newProjectEntry);
                }

                // 2. Save back to module
                await ContentService.saveContent({
                    ...currentContent,
                    projects: projects
                });
                console.log('Synced project change to Main Site JSON');
            }
        } catch (syncErr) {
            console.error('Error syncing to JSON blob:', syncErr);
            // Don't fail the request, just log it. The SQL update is the source of truth.
        }

        if (id === 'new') {
            throw redirect(303, '/admin/projects');
        }

        return { success: true };
    },

    delete: async ({ params, locals }) => {
        if (!locals.user) throw error(401, 'Unauthorized');
        const { id } = params;

        // 1. Get project details first to know the slug/title for sync
        const { data: project } = await supabase
            .from('project_details')
            .select('title, slug')
            .eq('id', id)
            .single();

        // 2. Delete from SQL
        const { error: deleteError } = await supabase
            .from('project_details')
            .delete()
            .eq('id', id);

        if (deleteError) {
            return { success: false, error: deleteError.message };
        }

        // 3. Sync with JSON Blob (Remove it)
        if (project) {
            try {
                const { data: currentContent } = await ContentService.getContent();
                if (currentContent && currentContent.projects) {
                    const newProjects = currentContent.projects.filter((p: any) =>
                        p.title !== project.title &&
                        p.link !== `/projects/${project.slug}`
                    );

                    await ContentService.saveContent({
                        ...currentContent,
                        projects: newProjects
                    });
                    console.log('Removed project from Main Site JSON');
                }
            } catch (err) {
                console.error('Error syncing delete to JSON:', err);
            }
        }

        throw redirect(303, '/admin/projects');
    }
};
