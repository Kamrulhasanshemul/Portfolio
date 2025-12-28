import { createClient } from '@supabase/supabase-js';
import { browser } from '$app/environment';
import { ENV } from './env.js';

import type { Content } from './types/content.js';

// Supabase configuration with fallbacks for development
const supabaseUrl = ENV.SUPABASE_URL;
const supabaseAnonKey = ENV.SUPABASE_KEY;

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Only log in server environment
if (!browser) {
	console.log('Supabase client initialized with URL:', supabaseUrl);
	console.log(
		'Using API key:',
		supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'NO KEY FOUND'
	);
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
// Storage operations
export class StorageService {
	private static BUCKET_NAME = 'portfolio';

	// Upload image to storage
	static async uploadImage(file: File, path: string = 'uploads') {
		try {
			console.log(`Uploading file ${file.name} to ${path}...`);

			// Create a unique filename to avoid collisions
			const timestamp = Date.now();
			const fileExt = file.name.split('.').pop();
			const fileName = `${timestamp}-${Math.random().toString(36).substring(7)}.${fileExt}`;
			const filePath = `${path}/${fileName}`;

			const { data, error } = await supabase.storage
				.from(this.BUCKET_NAME)
				.upload(filePath, file, {
					cacheControl: '3600',
					upsert: false
				});

			if (error) {
				console.error('Error uploading image:', error);
				// Check if bucket exists, if not try to default or create? 
				// NOTE: Buckets usually need to be created in dashboard or via SQL.
				return { success: false, error };
			}

			// Get public URL
			const { data: { publicUrl } } = supabase.storage
				.from(this.BUCKET_NAME)
				.getPublicUrl(filePath);

			return { success: true, url: publicUrl, path: filePath };
		} catch (err) {
			console.error('Unexpected error uploading image:', err);
			return { success: false, error: err };
		}
	}

	// Delete image from storage
	static async deleteImage(urlOrPath: string) {
		try {
			// Extract path from URL if needed, or use as is
			let path = urlOrPath;
			if (urlOrPath.startsWith('http')) {
				// Try to extract relative path after bucket name
				const urlParts = urlOrPath.split(`${this.BUCKET_NAME}/`);
				if (urlParts.length > 1) {
					path = urlParts[1];
				} else {
					// Fallback for different URL structures or just return if not our bucket
					console.warn('Could not extract path from URL:', urlOrPath);
					return { success: false, error: 'User provided external URL' };
				}
			}

			console.log(`Deleting image at ${path}...`);
			const { error } = await supabase.storage
				.from(this.BUCKET_NAME)
				.remove([path]);

			if (error) {
				console.error('Error deleting image:', error);
				return { success: false, error };
			}

			return { success: true };
		} catch (err) {
			console.error('Unexpected error deleting image:', err);
			return { success: false, error: err };
		}
	}
}
