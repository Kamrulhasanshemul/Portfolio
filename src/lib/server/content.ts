import { supabaseAdmin } from './supabase';
import type { Content } from '$lib/types/content';

// Server-side content persistence. Uses the service role so writes are never
// blocked by RLS — callers are responsible for auth (session cookie via hooks).
export class ServerContentService {
	static async getContent(): Promise<Content | null> {
		try {
			const { data, error } = await supabaseAdmin
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

	static async saveContent(
		content: Content
	): Promise<{ success: boolean; data?: Content; error?: unknown }> {
		try {
			const { data: existing, error: selectError } = await supabaseAdmin
				.from('portfolio_content')
				.select('id')
				.limit(1)
				.single();

			if (selectError && selectError.code !== 'PGRST116') {
				console.error('Error checking existing content:', selectError);
			}

			if (existing) {
				const { data, error } = await supabaseAdmin
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
				return { success: true, data: data.content_data };
			} else {
				const { data, error } = await supabaseAdmin
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
				return { success: true, data: data.content_data };
			}
		} catch (err) {
			console.error('Unexpected error saving content:', err);
			return { success: false, error: err };
		}
	}
}
