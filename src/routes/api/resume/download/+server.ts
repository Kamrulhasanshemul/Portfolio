import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabaseAdmin } from '$lib/server/supabase';
import { ContentService } from '$lib/supabase';

export const GET: RequestHandler = async () => {
	try {
		// 1. Get the current active resume path from DB
		const content = await ContentService.getContent();
		const resumePath = content?.contact?.resumeUrl;

		if (!resumePath) {
			throw error(404, 'Resume not found (No resume linked in profile)');
		}

		// 2. Fetch the file from Private Bucket 'resumes'
		console.log(`Attempting to download resume: ${resumePath}`);

		const { data, error: downloadError } = await supabaseAdmin.storage
			.from('resumes')
			.download(resumePath);

		if (downloadError) {
			console.error('Resume Download Error:', downloadError);
			throw error(404, 'Resume file not found in storage');
		}

		// 3. Return the file stream
		// Supabase download returns a Blob/File. We need to convert to ArrayBuffer/stream

		const headers = new Headers();
		headers.set('Content-Type', data.type);
		headers.set('Content-Disposition', `attachment; filename="Resume_Kamrul_Hasan_Shemul.pdf"`);
		headers.set('Cache-Control', 'public, max-age=60'); // Cache for 1 min

		return new Response(data, { headers });
	} catch (err) {
		console.error('Resume Access Error:', err);
		const httpErr = err as { status?: number; body?: { message?: string }; message?: string };
		throw error(
			httpErr.status || 500,
			httpErr.body?.message || httpErr.message || 'Internal Server Error'
		);
	}
};
