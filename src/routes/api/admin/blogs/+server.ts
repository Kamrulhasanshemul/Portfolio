import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabaseAdmin } from '$lib/server/supabase';
import { generateSlug, calculateReadingTime } from '$lib/blog';
import type { BlogPost } from '$lib/types/blog';

const LIST_COLUMNS =
	'id, title, slug, status, category, created_at, updated_at, views, published_at, featured_image, author, excerpt, tags, reading_time';

// GET - List posts, or fetch a single full post with ?id=<uuid>
export const GET: RequestHandler = async ({ url, locals }) => {
	if (!locals.user) {
		return json({ success: false, error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const id = url.searchParams.get('id');

		// Single post with full content (used by the editor)
		if (id) {
			const { data, error } = await supabaseAdmin
				.from('blog_posts')
				.select('*')
				.eq('id', id)
				.single();

			if (error) {
				return json({ success: false, error: error.message }, { status: 404 });
			}
			return json({ success: true, data });
		}

		const category = url.searchParams.get('category');
		const status = url.searchParams.get('status');
		const limit = parseInt(url.searchParams.get('limit') || '50');
		const offset = parseInt(url.searchParams.get('offset') || '0');

		let query = supabaseAdmin
			.from('blog_posts')
			.select(LIST_COLUMNS)
			.order('created_at', { ascending: false });

		if (category) query = query.eq('category', category);
		if (status) query = query.eq('status', status);

		query = query.range(offset, offset + limit - 1);

		const { data, error } = await query;

		if (error) {
			console.error('Error fetching admin blog posts:', error);
			return json({ success: false, error: error.message }, { status: 500 });
		}

		return json(
			{ success: true, data },
			{ headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' } }
		);
	} catch (error) {
		console.error('Error in admin blogs endpoint:', error);
		return json({ success: false, error: 'Internal server error' }, { status: 500 });
	}
};

// Normalize incoming post data before it hits the database
function preparePost(post: Partial<BlogPost>) {
	const prepared = { ...post };
	delete prepared.id;
	delete prepared.created_at;
	delete prepared.updated_at;

	if (prepared.title && !prepared.slug) {
		prepared.slug = generateSlug(prepared.title);
	}
	if (prepared.content !== undefined) {
		prepared.reading_time = calculateReadingTime(prepared.content || '');
	}
	if (Array.isArray(prepared.tags)) {
		prepared.tags = prepared.tags.map((t) => String(t).trim()).filter(Boolean);
	}
	return prepared;
}

// POST - Create a post
export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ success: false, error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const post = (await request.json()) as Partial<BlogPost>;

		if (!post.title) {
			return json({ success: false, error: 'Title is required' }, { status: 400 });
		}

		const prepared = preparePost(post);
		const now = new Date().toISOString();

		const { data, error } = await supabaseAdmin
			.from('blog_posts')
			.insert({
				...prepared,
				author: prepared.author || locals.user.username,
				created_at: now,
				updated_at: now,
				published_at: prepared.status === 'published' ? now : null
			})
			.select()
			.single();

		if (error) {
			console.error('Error creating blog post:', error);
			return json({ success: false, error: error.message }, { status: 400 });
		}

		return json({ success: true, data });
	} catch (error) {
		console.error('Error creating blog post:', error);
		return json({ success: false, error: 'Internal server error' }, { status: 500 });
	}
};

// PUT - Update a post
export const PUT: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ success: false, error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { id, ...updates } = (await request.json()) as Partial<BlogPost> & { id?: string };

		if (!id) {
			return json({ success: false, error: 'Post ID is required' }, { status: 400 });
		}

		const prepared = preparePost(updates);

		// Stamp published_at the first time a post goes live
		if (prepared.status === 'published' && !prepared.published_at) {
			prepared.published_at = new Date().toISOString();
		}

		const { data, error } = await supabaseAdmin
			.from('blog_posts')
			.update({
				...prepared,
				updated_at: new Date().toISOString()
			})
			.eq('id', id)
			.select()
			.single();

		if (error) {
			console.error('Error updating blog post:', error);
			return json({ success: false, error: error.message }, { status: 400 });
		}

		return json({ success: true, data });
	} catch (error) {
		console.error('Error updating blog post:', error);
		return json({ success: false, error: 'Internal server error' }, { status: 500 });
	}
};

// DELETE - Delete a post
export const DELETE: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ success: false, error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { id } = await request.json();

		if (!id) {
			return json({ success: false, error: 'Post ID is required' }, { status: 400 });
		}

		const { error } = await supabaseAdmin.from('blog_posts').delete().eq('id', id);

		if (error) {
			console.error('Error deleting blog post:', error);
			return json({ success: false, error: error.message }, { status: 400 });
		}

		return json({ success: true });
	} catch (error) {
		console.error('Error deleting blog post:', error);
		return json({ success: false, error: 'Internal server error' }, { status: 500 });
	}
};
