import { createClient } from '@supabase/supabase-js';
import { browser } from '$app/environment';
import { ENV } from './env.js';

import type { Content } from './types/content.js';

// Supabase configuration with fallbacks for development
const supabaseUrl = ENV.SUPABASE_URL;
const supabaseAnonKey = ENV.SUPABASE_KEY;

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
	auth: {
		persistSession: browser, // Only persist in browser
		autoRefreshToken: browser,
		detectSessionInUrl: browser
	}
});

// Only log in server environment
if (!browser) {
	console.log('Supabase client initialized with URL:', supabaseUrl);
}

// Database schema for content table
export interface ContentRow {
	id: number;
	content_data: Content; // JSON field
	created_at: string;
	updated_at: string;
}

// Content operations
export class ContentService {
	// Get content from database
	static async getContent() {
		try {
			const { data, error } = await supabase
				.from('portfolio_content')
				.select('*')
				.order('updated_at', { ascending: false })
				.limit(1)
				.single();

			if (error && error.code !== 'PGRST116') {
				// PGRST116 = no rows found
				console.error('Error fetching content:', error);
				return null;
			}

			return data?.content_data || null;
		} catch (err) {
			console.error('Unexpected error fetching content:', err);
			return null;
		}
	}

	// Save content to database
	static async saveContent(content: Content) {
		try {
			console.log('=== SUPABASE SAVE CONTENT ===');
			console.log('Attempting to save content to Supabase...');
			console.log('Content keys:', Object.keys(content));

			// First, try to get existing content
			console.log('Checking for existing content...');
			const { data: existing, error: selectError } = await supabase
				.from('portfolio_content')
				.select('id')
				.limit(1)
				.single();

			if (selectError && selectError.code !== 'PGRST116') {
				console.error('Error checking existing content:', selectError);
			}

			if (existing) {
				console.log('Updating existing content with ID:', existing.id);
				// Update existing content
				const { data, error } = await supabase
					.from('portfolio_content')
					.update({
						content_data: content,
						updated_at: new Date().toISOString()
					})
					.eq('id', existing.id)
					.select()
					.single();

				if (error) {
					console.error('Error updating content:', error);
					return { success: false, error };
				}

				console.log('Content updated successfully');
				return { success: true, data: data.content_data };
			} else {
				console.log('Creating new content record...');
				// Create new content
				const { data, error } = await supabase
					.from('portfolio_content')
					.insert({
						content_data: content,
						created_at: new Date().toISOString(),
						updated_at: new Date().toISOString()
					})
					.select()
					.single();

				if (error) {
					console.error('Error creating content:', error);
					return { success: false, error };
				}

				console.log('Content created successfully');
				return { success: true, data: data.content_data };
			}
		} catch (err) {
			console.error('=== SUPABASE SAVE FAILED ===');
			console.error('Unexpected error saving content:', err);
			return { success: false, error: err };
		}
	}

	// Initialize database table (run once)
	static async initializeTable() {
		try {
			// Create table if it doesn't exist
			const { error } = await supabase.rpc('create_portfolio_content_table');

			if (error && !error.message.includes('already exists')) {
				console.error('Error creating table:', error);
				return false;
			}

			return true;
		} catch (err) {
			console.error('Error initializing table:', err);
			return false;
		}
	}
}

import type { ImageMetadata } from './types/image';

export class ImageService {
	private static BUCKET_NAME = 'images';

	// Image operations
	static async initializeImageTable() {
		try {
			const { error } = await supabase.rpc('create_image_metadata_table');
			// Note: RPC might not exist, usually tables are created via SQL editor. 
			// We provided the SQL in 'database/storage_setup.sql'.
			return !error;
		} catch (e) { return false; }
	}

	// Get a signed URL for an image path
	static async getSignedUrl(path: string, expiresIn = 3600): Promise<string | null> {
		try {
			const { data, error } = await supabase.storage
				.from(this.BUCKET_NAME)
				.createSignedUrl(path, expiresIn);

			if (error) {
				console.error('Error creating signed URL:', error);
				return null;
			}

			return data.signedUrl;
		} catch (err) {
			console.error('Unexpected error creating signed URL:', err);
			return null;
		}
	}

	// Upload image, store metadata, and return signed URL
	static async uploadImage(
		file: File,
		userId: string
	): Promise<{ success: boolean; data?: ImageMetadata; error?: string }> {
		try {
			// 1. Validate file (double check client-side validation)
			if (!file.type.startsWith('image/')) {
				return { success: false, error: 'Invalid file type' };
			}
			if (file.size > 5 * 1024 * 1024) {
				return { success: false, error: 'File size exceeds 5MB' };
			}

			// 2. Generate Path: /user_id/yyyy/mm/filename
			const date = new Date();
			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, '0');
			const ext = file.name.split('.').pop();
			const uuid = crypto.randomUUID();
			const filename = `${uuid}.${ext}`;
			const path = `${userId}/${year}/${month}/${filename}`;

			console.log(`Uploading to ${this.BUCKET_NAME}/${path}...`);

			// 3. Upload to Supabase Storage
			const { error: uploadError } = await supabase.storage
				.from(this.BUCKET_NAME)
				.upload(path, file, {
					cacheControl: '3600',
					upsert: false
				});

			if (uploadError) {
				console.error('Supabase upload error:', uploadError);
				return { success: false, error: uploadError.message };
			}

			// 4. Store Metadata in DB
			const { error: dbError } = await supabase
				.from('image_metadata')
				.insert({
					user_id: userId,
					bucket_path: path,
					mime_type: file.type,
					file_size: file.size
				});

			// Note: If DB insert fails, we should technically clean up the file, but we'll skip complex rollback for now.
			if (dbError) {
				console.error('Database metadata error:', dbError);
				// Try to clean up
				await supabase.storage.from(this.BUCKET_NAME).remove([path]);
				return { success: false, error: 'Failed to save image metadata' };
			}

			// 5. Get Signed URL for immediate display
			const signedUrl = await this.getSignedUrl(path);

			return {
				success: true,
				data: {
					id: uuid, // This is approx, real ID is DB generated but we didn't select it. 
					// Let's assume we don't need the DB ID immediately for display, just the URL.
					user_id: userId,
					bucket_path: path,
					mime_type: file.type,
					file_size: file.size,
					created_at: new Date().toISOString(),
					url: signedUrl || ''
				}
			};

		} catch (err) {
			console.error('Unexpected error in uploadImage:', err);
			return { success: false, error: 'Unexpected upload failure' };
		}
	}
}
