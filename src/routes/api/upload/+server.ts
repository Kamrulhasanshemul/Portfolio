
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { StorageService } from '$lib/supabase';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const path = (formData.get('path') as string) || 'uploads';
        const oldUrl = formData.get('oldUrl') as string;

        if (!file) {
            return json({ error: 'No file provided' }, { status: 400 });
        }

        console.log(`Processing upload for ${file.name} (Size: ${file.size} bytes)`);

        // Delete old image if provided
        if (oldUrl) {
            console.log('Replacing existing image:', oldUrl);
            // Don't fail if delete fails, just log it
            try {
                await StorageService.deleteImage(oldUrl);
            } catch (delErr) {
                console.warn('Failed to delete old image:', delErr);
            }
        }

        // Upload new image
        const result = await StorageService.uploadImage(file, path);

        if (result.success) {
            console.log('Upload successful:', result.url);
            return json({
                success: true,
                url: result.url,
                path: result.path
            });
        } else {
            console.error('Upload failed:', result.error);
            return json({ error: 'Failed to upload image', details: result.error }, { status: 500 });
        }

    } catch (error) {
        console.error('Server upload error:', error);
        return json({
            error: 'Internal server error during upload',
            details: (error as Error).message
        }, { status: 500 });
    }
};
