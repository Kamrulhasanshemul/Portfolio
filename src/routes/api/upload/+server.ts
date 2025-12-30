import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createClient } from '@supabase/supabase-js';
import { ENV } from '$lib/env.js';
import { env } from '$env/dynamic/private';

export const POST: RequestHandler = async ({ request, locals }) => {
    // 1. Check Authentication (Custom Session)
    if (!locals.user) {
        console.warn('Upload attempt unauthorized. Locals:', locals, 'Cookies:', request.headers.get('cookie'));
        return json({ error: 'You must be logged in to upload images.' }, { status: 401 });
    }

    try {
        // 2. Setup Supabase Admin Client (Service Role)
        const supabaseUrl = ENV.SUPABASE_URL;
        const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY || ENV.SUPABASE_KEY; // Fallback to Anon (will fail RLS) if missing, but warn.

        if (!env.SUPABASE_SERVICE_ROLE_KEY) {
            console.warn('SUPABASE_SERVICE_ROLE_KEY is missing! Uploads to private/RLS buckets will fail.');
        }

        const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        });

        const formData = await request.formData();
        const file = formData.get('file') as File;
        const pathContext = (formData.get('path') as string) || 'uploads';
        const oldUrl = formData.get('oldUrl') as string;

        if (!file) {
            return json({ error: 'No file provided' }, { status: 400 });
        }

        console.log(`Processing upload for ${file.name} (Size: ${file.size} bytes)`);

        // 3. Delete old image if provided
        if (oldUrl) {
            try {
                // Extract path from URL if possible, or just ignore cleanup for MVP to avoid deleting wrong things
                // Basic cleanup logic:
                const urlObj = new URL(oldUrl);
                const pathParts = urlObj.pathname.split('/storage/v1/object/public/images/');
                if (pathParts.length > 1) {
                    const oldPath = pathParts[1];
                    console.log('Deleting old image:', oldPath);
                    await supabaseAdmin.storage.from('images').remove([oldPath]);
                }
            } catch (delErr) {
                console.warn('Failed to delete old image:', delErr);
            }
        }

        // 4. Generate Path and Upload
        // Structure: /context/timestamp_filename
        const timestamp = Date.now();
        // Sanitize filename
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const storagePath = `${pathContext}/${timestamp}_${safeName}`;

        // Upload to 'images' bucket
        const { data, error: uploadError } = await supabaseAdmin.storage
            .from('images')
            .upload(storagePath, file, {
                contentType: file.type,
                upsert: false
            });

        if (uploadError) {
            console.error('Supabase upload error:', uploadError);
            return json({ error: uploadError.message }, { status: 500 });
        }

        // 5. Get Public URL (Assuming 'images' bucket is public)
        const { data: { publicUrl } } = supabaseAdmin.storage
            .from('images')
            .getPublicUrl(storagePath);

        return json({
            success: true,
            url: publicUrl,
            path: storagePath
        });

    } catch (error) {
        console.error('Server upload error:', error);
        return json({
            error: 'Internal server error during upload',
            details: (error as Error).message
        }, { status: 500 });
    }
};

export const DELETE: RequestHandler = async ({ request, locals }) => {
    if (!locals.user) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { url } = await request.json();
        if (!url) {
            return json({ error: 'URL is required' }, { status: 400 });
        }

        const supabaseUrl = ENV.SUPABASE_URL;
        const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY || ENV.SUPABASE_KEY;

        const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        });

        // Extract path from URL
        // Expected format: .../storage/v1/object/public/images/path/to/file
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split('/storage/v1/object/public/images/');

        if (pathParts.length > 1) {
            const path = pathParts[1];
            const { error } = await supabaseAdmin.storage.from('images').remove([path]);

            if (error) {
                console.error('Supabase delete error:', error);
                return json({ error: error.message }, { status: 500 });
            }
        }

        return json({ success: true });
    } catch (error) {
        console.error('Delete error:', error);
        return json({ error: 'Internal server error' }, { status: 500 });
    }
};
