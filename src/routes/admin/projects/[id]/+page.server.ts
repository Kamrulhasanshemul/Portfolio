import { error, redirect } from '@sveltejs/kit';
import { supabase, ContentService } from '$lib/supabase';
import type { PageServerLoad, Actions } from './$types';
import type { Project } from '$lib/types/content';

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
		const is_featured =
			formData.get('is_featured') === 'true' || formData.get('is_featured') === 'on';
		const featured_image = formData.get('featured_image') as string;
		const live_demo_url = formData.get('live_demo_url') as string;
		const github_url = formData.get('github_url') as string;

		// Complex fields are sent as JSON strings because standard FormData is flat
		// The client-side will JSON.stringify these arrays before submitting
		const full_description = formData.get('full_description') as string;
		const technologies = JSON.parse((formData.get('technologies') as string) || '[]');
		const key_features = JSON.parse((formData.get('key_features') as string) || '[]');
		const challenges_solved = JSON.parse((formData.get('challenges_solved') as string) || '[]');
		const results_achieved = JSON.parse((formData.get('results_achieved') as string) || '[]');
		const images = JSON.parse((formData.get('images') as string) || '[]');
		const videos = JSON.parse((formData.get('videos') as string) || '[]');

		const payload = {
			title,
			slug,
			short_description,
			full_description,
			category,
			status,
			project_date: project_date || null,
			// is_featured, // TEMPORARILY DISABLED: Database column missing in user environment
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

		// Helper to run query
		const runQuery = async (data: Record<string, unknown>) => {
			console.log('Running DB Query with payload keys:', Object.keys(data));
			if (id === 'new') {
				return await supabase.from('project_details').insert(data);
			} else {
				return await supabase.from('project_details').update(data).eq('id', id);
			}
		};

		let result = await runQuery(payload);

		// Fallback for missing column
		if (result.error) {
			console.error('Initial DB Save Error:', result.error);
			const msg = result.error.message.toLowerCase();
			// Catch both Postgres "column does not exist" and Postgrest "Could not find..." errors
			if (
				(msg.includes('column') && msg.includes('does not exist')) ||
				msg.includes('could not find the') ||
				msg.includes('is_featured')
			) {
				console.warn(
					'Column missing in DB (detected via error match), retrying without is_featured...'
				);
				const { is_featured: _isFeatured, ...safePayload } = payload as Record<string, unknown>;
				result = await runQuery(safePayload);
			}
		}

		if (result.error) {
			console.error('Final Project Save Error:', result.error);
			return { success: false, error: result.error.message };
		}

		// If new, redirect to list or stay?
		// For now, let's just proceed to sync.

		// --- SYNC WITH MAIN SITE JSON (portfolio_content) ---
		try {
			console.log('Starting Sync with Main Site JSON...');
			// 1. Fetch current content
			const currentContent = await ContentService.getContent();

			if (currentContent) {
				const projects = currentContent.projects || [];
				// ... (existing sync logic)
				const projectIndex = projects.findIndex(
					(p: Project) =>
						p.title === title || p.title.toLowerCase().replace(/[^a-z0-9]/g, '-') === slug
				);

				// Construct entry
				const newProjectEntry = {
					title: title,
					description: short_description,
					technologies: technologies,
					impact: results_achieved?.[0]?.description || 'View Case Study',
					link: `/projects/${slug}`,
					image: featured_image,
					featured: is_featured // Add this to sync as well
				};

				if (projectIndex >= 0) {
					projects[projectIndex] = newProjectEntry;
				} else {
					projects.push(newProjectEntry);
				}

				await ContentService.saveContent({
					...currentContent,
					projects: projects
				});
				console.log('Sync to JSON successful');
			}
		} catch (syncErr) {
			// Do NOT fail the request if sync fails
			console.error('Warning: Sync to Main Site JSON failed, but DB save was successful.', syncErr);
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
		const { error: deleteError } = await supabase.from('project_details').delete().eq('id', id);

		if (deleteError) {
			return { success: false, error: deleteError.message };
		}

		// 3. Sync with JSON Blob (Remove it)
		if (project) {
			try {
				const currentContent = await ContentService.getContent();
				if (currentContent && currentContent.projects) {
					const newProjects = currentContent.projects.filter(
						(p: Project) => p.title !== project.title && p.link !== `/projects/${project.slug}`
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
