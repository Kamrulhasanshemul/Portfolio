import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ServerContentService as ContentService } from '$lib/server/content';
import { defaultContent, normalizeContent } from '$lib/default-content';

// GET - Fetch content from Supabase database
export const GET: RequestHandler = async () => {
	try {
		const content = await ContentService.getContent();

		if (content) {
			// Normalize so records saved under older schemas render completely
			return json(normalizeContent(content));
		} else {
			// Save default content to database for next time
			await ContentService.saveContent(defaultContent);
			return json(defaultContent);
		}
	} catch (error) {
		console.error('Error fetching content from database:', error);
		// Return default content as fallback
		return json(defaultContent);
	}
};

// POST - Create new content in database
export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}
	try {
		const requestData = await request.json();
		const contentToSave = Object.keys(requestData).length > 0 ? requestData : defaultContent;

		const result = await ContentService.saveContent(contentToSave);

		if (result.success) {
			return json(result.data);
		} else {
			console.error('Failed to save content:', result.error);
			return json({ error: 'Failed to save content' }, { status: 500 });
		}
	} catch (error) {
		console.error('Error creating content:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

// PUT - Update existing content in database
export const PUT: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}
	try {
		const updatedContent = await request.json();

		// Validate that required sections exist
		const requiredSections = [
			'hero',
			'stats',
			'about',
			'services',
			'projects',
			'skills',
			'experience',
			'contact'
		];
		const missingSections = requiredSections.filter((section) => !updatedContent[section]);

		if (missingSections.length > 0) {
			console.warn('Missing required sections:', missingSections);
			return json(
				{ error: `Missing required sections: ${missingSections.join(', ')}` },
				{ status: 400 }
			);
		}

		const result = await ContentService.saveContent(updatedContent);

		if (result.success) {
			return json(result.data);
		} else {
			console.error('Failed to update content:', result.error);
			console.error('Error details:', JSON.stringify(result.error, null, 2));
			return json({ error: 'Failed to update content', details: result.error }, { status: 500 });
		}
	} catch (error) {
		console.error('Error updating content:', error);
		return json(
			{ error: 'Internal server error', details: (error as Error).message },
			{ status: 500 }
		);
	}
};
