import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabaseAdmin } from '$lib/server/supabase';

export const POST: RequestHandler = async ({ request, locals }) => {
	// 1. Auth Check
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const formData = await request.formData();
		const file = formData.get('file') as File;

		if (!file) {
			return json({ error: 'No file provided' }, { status: 400 });
		}

		// 2. Validate File Type
		const allowedTypes = [
			'application/pdf',
			'application/msword',
			'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
		];
		if (!allowedTypes.includes(file.type)) {
			return json(
				{ error: 'Invalid file type. Only PDF and Word documents are allowed.' },
				{ status: 400 }
			);
		}

		// 3. Upload to Supabase Storage (Private Bucket 'resumes')
		// Using upsert to overwrite existing 'resume.pdf' or similar to keep it simple?
		// Or unique names? Let's use a standard name "latest_resume" + extension to make "latest" logic easier,
		// or just store the path. Storing unique path is safer for cache busting.

		const fileExt = file.name.split('.').pop();
		const fileName = `resume_${Date.now()}.${fileExt}`;
		const filePath = `${fileName}`; // Root of bucket

		const { data, error } = await supabaseAdmin.storage
			.from('resumes') // Ensure this bucket exists!
			.upload(filePath, file, {
				contentType: file.type,
				upsert: false
			});

		if (error) {
			console.error('Supabase Storage Upload Error:', error);
			// If bucket doesn't exist error
			if (error.message.includes('Bucket not found')) {
				return json(
					{ error: 'Storage bucket "resumes" not found. Please create it in Supabase.' },
					{ status: 500 }
				);
			}
			return json({ error: error.message }, { status: 500 });
		}

		// 4. Return success with the Path (not public URL)
		return json({
			success: true,
			path: data.path,
			url: data.path // We use the path as the "url" reference for our download proxy
		});
	} catch (error) {
		console.error('Resume Upload Error:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
