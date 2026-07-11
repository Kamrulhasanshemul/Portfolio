import type { PageServerLoad } from './$types';
import { ContentService, supabase } from '$lib/supabase';
import { normalizeContent } from '$lib/default-content';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	try {
		console.log('Server load: Fetching content...');
		const content = normalizeContent(await ContentService.getContent());

		// Fetch Projects from SQL to ensure "Project Management" is the source of truth
		const { data: sqlProjects, error: projectError } = await supabase
			.from('project_details')
			.select('*')
			.eq('status', 'published')
			.order('project_date', { ascending: false });

		if (!projectError && sqlProjects) {
			console.log(`Loaded ${sqlProjects.length} projects from SQL.`);
			// Map SQL projects to the UI Project interface
			// improved: Always overwrite, even if empty, to prevent "zombie" JSON data
			content.projects = sqlProjects.map((p) => ({
				title: p.title,
				description: p.short_description,
				technologies: p.technologies || [],
				impact: p.impact || p.results_achieved?.[0]?.description || 'View Case Study',
				link: `/projects/${p.slug}`,
				image: p.featured_image,
				featured: !!p.is_featured
			}));

			// If nothing is flagged featured (or the is_featured column doesn't
			// exist yet), surface the newest published projects instead of an
			// empty "Selected Work" section.
			if (content.projects.length > 0 && !content.projects.some((p) => p.featured)) {
				content.projects = content.projects.map((p, i) => ({ ...p, featured: i < 3 }));
			}
		} else if (projectError) {
			console.error('Error fetching projects from SQL:', projectError);
		}

		return { content };
	} catch (err) {
		console.error('Server load error:', err);
		throw error(500, 'Failed to load content');
	}
};
