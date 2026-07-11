<svelte:options runes={true} />

<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Badge } from '$lib/components/ui/badge';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Card from '$lib/components/ui/card';
	import * as Select from '$lib/components/ui/select';
	import * as Table from '$lib/components/ui/table';
	import ImageUpload from '$lib/components/admin/ImageUpload.svelte';
	import RichTextEditor from '$lib/components/RichTextEditor.svelte';
	import { Plus, Search, RefreshCw, Edit, Trash2, Eye, ArrowLeft } from '@lucide/svelte';

	import type { BlogPost, BlogCategory } from '$lib/types/blog';
	import type { Content } from '$lib/types/content';
	import { generateSlug } from '$lib/blog';
	import { blogCategories } from '$lib/types/blog';

	let { content } = $props<{ content: Content | null }>(); // author fallback

	let blogPosts = $state<BlogPost[]>([]);
	let blogLoading = $state(false);
	let editorLoading = $state(false);
	let blogError = $state('');
	let showBlogEditor = $state(false);
	let editingBlogPost = $state<BlogPost | null>(null);
	let tagsInput = $state('');
	let searchQuery = $state('');
	let blogFilters = $state<{ category: BlogCategory | ''; status: string }>({
		category: '',
		status: ''
	});

	const filteredPosts = $derived(
		blogPosts.filter((post) => {
			if (!searchQuery) return true;
			const q = searchQuery.toLowerCase();
			return (
				post.title.toLowerCase().includes(q) ||
				post.slug.toLowerCase().includes(q) ||
				(post.excerpt || '').toLowerCase().includes(q)
			);
		})
	);

	// Load blog posts on mount
	$effect(() => {
		loadBlogPosts();
	});

	async function loadBlogPosts() {
		blogLoading = true;
		blogError = '';

		try {
			const params = new URLSearchParams();
			if (blogFilters.category) params.append('category', blogFilters.category);
			if (blogFilters.status) params.append('status', blogFilters.status);

			const response = await fetch(`/api/admin/blogs?${params.toString()}`);
			const result = await response.json();

			if (result.success) {
				blogPosts = result.data || [];
			} else {
				blogError = result.error || 'Failed to load blog posts';
			}
		} catch (error) {
			console.error('Error loading blog posts:', error);
			blogError = 'Failed to load blog posts';
		} finally {
			blogLoading = false;
		}
	}

	function createNewBlogPost(): BlogPost {
		return {
			title: '',
			slug: '',
			content: '',
			excerpt: '',
			category: 'personal',
			tags: [],
			author: content?.hero?.name || 'Admin',
			status: 'draft',
			meta_description: '',
			featured_image: '',
			reading_time: 1
		};
	}

	function startNewBlogPost() {
		editingBlogPost = createNewBlogPost();
		tagsInput = '';
		blogError = '';
		showBlogEditor = true;
	}

	async function editBlogPost(post: BlogPost) {
		// The list omits the post body — fetch the full post before editing,
		// otherwise saving would wipe the content.
		editorLoading = true;
		blogError = '';
		try {
			const response = await fetch(`/api/admin/blogs?id=${post.id}`);
			const result = await response.json();
			if (result.success && result.data) {
				editingBlogPost = { ...result.data };
				tagsInput = (result.data.tags || []).join(', ');
				showBlogEditor = true;
			} else {
				blogError = result.error || 'Failed to load post for editing';
			}
		} catch (error) {
			console.error('Error loading post:', error);
			blogError = 'Failed to load post for editing';
		} finally {
			editorLoading = false;
		}
	}

	function cancelBlogEdit() {
		showBlogEditor = false;
		editingBlogPost = null;
		blogError = '';
	}

	async function saveBlogPost() {
		if (!editingBlogPost) return;

		if (!editingBlogPost.title) {
			blogError = 'Title is required';
			return;
		}

		blogLoading = true;
		blogError = '';

		const payload = {
			...editingBlogPost,
			tags: tagsInput
				.split(',')
				.map((t) => t.trim())
				.filter(Boolean)
		};

		try {
			const response = await fetch('/api/admin/blogs', {
				method: editingBlogPost.id ? 'PUT' : 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});
			const result = await response.json();

			if (result.success) {
				await loadBlogPosts();
				showBlogEditor = false;
				editingBlogPost = null;
			} else {
				blogError = result.error || 'Failed to save blog post';
			}
		} catch (error) {
			console.error('Error saving blog post:', error);
			blogError = 'Failed to save blog post';
		} finally {
			blogLoading = false;
		}
	}

	async function deleteBlogPostConfirm(post: BlogPost) {
		if (!confirm(`Are you sure you want to delete "${post.title}"?`)) return;

		blogLoading = true;
		try {
			const response = await fetch('/api/admin/blogs', {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id: post.id })
			});
			const result = await response.json();
			if (result.success) {
				await loadBlogPosts();
			} else {
				alert(`Failed to delete: ${result.error}`);
			}
		} catch (error) {
			console.error('Error deleting post:', error);
			alert('Failed to delete blog post');
		} finally {
			blogLoading = false;
		}
	}
</script>

{#if showBlogEditor && editingBlogPost}
	<div class="mx-auto max-w-4xl">
		<div class="mb-4 flex items-center justify-between">
			<div class="flex items-center gap-2">
				<Button variant="ghost" size="icon" onclick={cancelBlogEdit}>
					<ArrowLeft class="h-4 w-4" />
				</Button>
				<h2 class="text-lg font-semibold">
					{editingBlogPost.id ? 'Edit Post' : 'New Post'}
				</h2>
			</div>
		</div>

		<Card.Root class="border-0 shadow-sm ring-1 ring-gray-200">
			<Card.Content class="space-y-6 pt-6">
				{#if blogError}
					<div class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800">
						{blogError}
					</div>
				{/if}

				<div class="grid gap-6 lg:grid-cols-3">
					<div class="space-y-4 lg:col-span-2">
						<div>
							<Label>Title</Label>
							<Input bind:value={editingBlogPost.title} placeholder="Post Title" class="mt-1" />
						</div>
						<div>
							<Label>Slug</Label>
							<div class="flex gap-2">
								<Input bind:value={editingBlogPost.slug} placeholder="post-slug" class="mt-1" />
								<Button
									variant="outline"
									size="icon"
									class="mt-1"
									title="Generate from title"
									onclick={() => {
										if (editingBlogPost) {
											editingBlogPost.slug = generateSlug(editingBlogPost.title);
										}
									}}
								>
									<RefreshCw class="h-4 w-4" />
								</Button>
							</div>
						</div>
						<div>
							<Label>Excerpt</Label>
							<Textarea
								bind:value={editingBlogPost.excerpt}
								placeholder="Short summary shown on the blog list and in previews"
								rows={2}
								class="mt-1"
							/>
						</div>
					</div>
					<div class="space-y-4">
						<div>
							<Label>Status</Label>
							<Select.Root type="single" bind:value={editingBlogPost.status}>
								<Select.Trigger class="mt-1 w-full capitalize"
									>{editingBlogPost.status}</Select.Trigger
								>
								<Select.Content>
									<Select.Item value="draft">Draft</Select.Item>
									<Select.Item value="published">Published</Select.Item>
									<Select.Item value="archived">Archived</Select.Item>
								</Select.Content>
							</Select.Root>
						</div>
						<div>
							<Label>Category</Label>
							<Select.Root type="single" bind:value={editingBlogPost.category}>
								<Select.Trigger class="mt-1 w-full"
									>{blogCategories[editingBlogPost.category]?.label || 'Select'}</Select.Trigger
								>
								<Select.Content>
									{#each Object.entries(blogCategories) as [key, config] (key)}
										<Select.Item value={key}>{config.label}</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>
						</div>
						<div>
							<Label>Tags</Label>
							<Input
								bind:value={tagsInput}
								placeholder="tag1, tag2, tag3"
								class="mt-1"
								title="Comma-separated tags"
							/>
						</div>
						<div>
							<Label>Author</Label>
							<Input bind:value={editingBlogPost.author} placeholder="Author" class="mt-1" />
						</div>
					</div>
				</div>

				<div>
					<Label>Featured Image</Label>
					<div class="mt-1">
						<ImageUpload bind:value={editingBlogPost.featured_image} path="blog-featured" />
					</div>
				</div>

				<div>
					<Label>Content</Label>
					<div class="mt-1 min-h-[400px] rounded-md border">
						<RichTextEditor bind:content={editingBlogPost.content} placeholder="Start writing..." />
					</div>
				</div>

				<div>
					<Label>Meta Description (SEO)</Label>
					<Textarea
						bind:value={editingBlogPost.meta_description}
						placeholder="Description used by search engines (~155 characters)"
						rows={2}
						class="mt-1"
					/>
				</div>

				<div class="flex justify-end gap-3 border-t pt-4">
					<Button variant="outline" onclick={cancelBlogEdit}>Cancel</Button>
					<Button onclick={saveBlogPost} disabled={blogLoading}>
						{#if blogLoading}Saving...{:else}Save Post{/if}
					</Button>
				</div>
			</Card.Content>
		</Card.Root>
	</div>
{:else}
	<!-- BLOG LIST TABLE -->
	<div class="space-y-4">
		{#if blogError}
			<div class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800">
				Error: {blogError}
			</div>
		{/if}

		<div class="flex items-center justify-between">
			<h2 class="text-lg font-medium">All Posts</h2>
			<Button onclick={startNewBlogPost}><Plus class="mr-2 h-4 w-4" /> New Post</Button>
		</div>

		<Card.Root class="border-0 shadow-sm ring-1 ring-gray-200">
			<Card.Content class="p-0">
				<div class="flex flex-wrap gap-4 border-b p-4">
					<div class="relative max-w-sm flex-1">
						<Search class="absolute top-2.5 left-2.5 h-4 w-4 text-gray-500" />
						<Input placeholder="Search posts..." class="h-9 pl-9" bind:value={searchQuery} />
					</div>

					<Select.Root
						type="single"
						bind:value={blogFilters.category}
						onValueChange={() => loadBlogPosts()}
					>
						<Select.Trigger class="h-9 w-[150px]">
							{blogFilters.category ? blogCategories[blogFilters.category]?.label : 'Category'}
						</Select.Trigger>
						<Select.Content>
							<Select.Item value="" label="All Categories">All Categories</Select.Item>
							{#each Object.entries(blogCategories) as [key, config] (key)}
								<Select.Item value={key} label={config.label}>{config.label}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>

					<Select.Root
						type="single"
						bind:value={blogFilters.status}
						onValueChange={() => loadBlogPosts()}
					>
						<Select.Trigger class="h-9 w-[130px] capitalize">
							{blogFilters.status || 'Status'}
						</Select.Trigger>
						<Select.Content>
							<Select.Item value="" label="All Statuses">All Statuses</Select.Item>
							<Select.Item value="draft">Draft</Select.Item>
							<Select.Item value="published">Published</Select.Item>
							<Select.Item value="archived">Archived</Select.Item>
						</Select.Content>
					</Select.Root>

					<Button variant="outline" size="icon" class="h-9 w-9" onclick={loadBlogPosts}>
						<RefreshCw class="h-4 w-4 {blogLoading ? 'animate-spin' : ''}" />
					</Button>
				</div>

				{#if blogLoading || editorLoading}
					<div class="p-12 text-center">Loading...</div>
				{:else if filteredPosts.length === 0}
					<div class="p-12 text-center text-gray-500">
						{searchQuery ? 'No posts match your search.' : 'No posts found. Write your first one!'}
					</div>
				{:else}
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.Head>Title</Table.Head>
								<Table.Head>Status</Table.Head>
								<Table.Head>Category</Table.Head>
								<Table.Head>Views</Table.Head>
								<Table.Head>Date</Table.Head>
								<Table.Head class="w-[100px]"></Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each filteredPosts as post (post.id)}
								<Table.Row>
									<Table.Cell class="font-medium">
										<div class="flex flex-col">
											<span class="max-w-[300px] truncate">{post.title}</span>
											<span class="max-w-[300px] truncate text-xs font-normal text-gray-500"
												>/{post.slug}</span
											>
										</div>
									</Table.Cell>
									<Table.Cell>
										<div class="flex items-center gap-2">
											<div
												class="h-2 w-2 rounded-full {post.status === 'published'
													? 'bg-emerald-500'
													: post.status === 'draft'
														? 'bg-zinc-300'
														: 'bg-red-500'}"
											></div>
											<span class="text-xs text-gray-600 capitalize">{post.status}</span>
										</div>
									</Table.Cell>
									<Table.Cell>
										<Badge variant="outline" class="text-xs font-normal"
											>{blogCategories[post.category]?.label ?? post.category}</Badge
										>
									</Table.Cell>
									<Table.Cell>
										<div class="flex items-center gap-1 text-sm text-gray-500">
											<Eye class="h-3 w-3" />
											{post.views ?? 0}
										</div>
									</Table.Cell>
									<Table.Cell class="text-sm text-gray-500">
										{new Date(post.created_at || '').toLocaleDateString()}
									</Table.Cell>
									<Table.Cell>
										<Button
											variant="ghost"
											size="icon"
											title="Edit"
											onclick={() => editBlogPost(post)}
										>
											<Edit class="h-4 w-4" />
										</Button>
										<Button
											variant="ghost"
											size="icon"
											title="Delete"
											onclick={() => deleteBlogPostConfirm(post)}
										>
											<Trash2 class="h-4 w-4 text-red-500" />
										</Button>
									</Table.Cell>
								</Table.Row>
							{/each}
						</Table.Body>
					</Table.Root>
				{/if}
			</Card.Content>
		</Card.Root>
	</div>
{/if}
