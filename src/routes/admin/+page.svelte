<script lang="ts">
	import { content } from '$lib/stores/content';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Label } from '$lib/components/ui/label';
	import { Badge } from '$lib/components/ui/badge';
	import * as Card from '$lib/components/ui/card';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Select from '$lib/components/ui/select';
	import * as Table from '$lib/components/ui/table';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import ImageUpload from '$lib/components/ImageUpload.svelte';
	import RichTextEditor from '$lib/components/RichTextEditor.svelte';
	import { onMount, onDestroy } from 'svelte';
	import type { Content, Skill } from '$lib/types/content';
	import type { BlogPost, BlogCategory } from '$lib/types/blog';
	import { blogCategories } from '$lib/types/blog';
	import {
		createBlogPost,
		updateBlogPost,
		deleteBlogPost,
		getBlogPosts,
		getBlogPost,
		generateSlug,
		formatDate,
		truncateHtml
	} from '$lib/blog';
	import {
		User,
		BarChart3,
		FileText,
		Briefcase,
		FolderOpen,
		Cpu,
		Award,
		Mail,
		Save,
		RefreshCw,
		Undo2,
		Plus,
		Trash2,
		Settings,
		Eye,
		Database,
		PenTool,
		Edit,
		Calendar,
		Tag,
		Clock,
		MoreHorizontal,
		Search,
		Filter
	} from '@lucide/svelte';

	let currentContent: Content | null = null;
	let isDirty = false;
	let lastSaved: Date | null = null;
	let isLoading = false;
	let saveMessage = '';
	let saveMessageType: 'success' | 'error' = 'success';
	let activeTab = 'hero';

	// Blog state
	let blogPosts: BlogPost[] = [];
	let editingBlogPost: BlogPost | null = null;
	let blogLoading = false;
	let blogError = '';
	let showBlogEditor = false;
	let blogFilters = {
		category: '' as BlogCategory | '',
		status: '' as 'draft' | 'published' | 'archived' | ''
	};

	// New blog post template
	const createNewBlogPost = (): Omit<BlogPost, 'id' | 'created_at' | 'updated_at'> => ({
		title: '',
		slug: '',
		content: '',
		excerpt: '',
		category: 'personal' as BlogCategory,
		tags: [],
		author: 'Admin',
		status: 'draft',
		featured_image: '',
		meta_description: '',
		reading_time: 1,
		views: 0,
		published_at: ''
	});

	// Subscribe to content changes
	const unsubscribe = content.subscribe((value: Content | null) => {
		if (value && Object.keys(value).length > 0) {
			console.log('Admin received content update with sections:', Object.keys(value));

			// Ensure all required sections exist
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
			const hasAllSections = requiredSections.every((section) => value[section as keyof Content]);

			if (!hasAllSections) {
				console.warn('Incomplete content received in admin, some sections missing');
				return;
			}

			currentContent = JSON.parse(JSON.stringify(value)); // Deep copy to track changes
			console.log('Admin content updated successfully');
		}
	});

	// Blog management functions
	async function loadBlogPosts() {
		blogLoading = true;
		blogError = '';

		try {
			const result = await getBlogPosts({
				category: blogFilters.category || undefined,
				status: blogFilters.status || undefined
			});

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

	async function startNewBlogPost() {
		editingBlogPost = createNewBlogPost() as BlogPost;
		showBlogEditor = true;
	}

	async function editBlogPost(post: BlogPost) {
		const result = await getBlogPost(post.id!);
		if (result.success && result.data) {
			editingBlogPost = JSON.parse(JSON.stringify(result.data));
			showBlogEditor = true;
		} else {
			blogError = result.error || 'Failed to load blog post';
		}
	}

	async function saveBlogPost() {
		if (!editingBlogPost) return;

		blogLoading = true;
		blogError = '';

		try {
			// Auto-generate slug if not set
			if (!editingBlogPost.slug) {
				editingBlogPost.slug = generateSlug(editingBlogPost.title);
			}

			// Auto-generate excerpt if not set
			if (!editingBlogPost.excerpt && editingBlogPost.content) {
				editingBlogPost.excerpt = truncateHtml(editingBlogPost.content, 150);
			}

			let result;
			if (editingBlogPost.id) {
				// Update existing post
				result = await updateBlogPost(editingBlogPost.id, editingBlogPost);
			} else {
				// Create new post
				result = await createBlogPost(editingBlogPost);
			}

			if (result.success) {
				showBlogEditor = false;
				editingBlogPost = null;
				await loadBlogPosts();
				saveMessage = 'Blog post saved successfully!';
				saveMessageType = 'success';
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
		if (
			!confirm(`Are you sure you want to delete "${post.title}"? This action cannot be undone.`)
		) {
			return;
		}

		blogLoading = true;
		blogError = '';

		try {
			const result = await deleteBlogPost(post.id!);

			if (result.success) {
				await loadBlogPosts();
				saveMessage = 'Blog post deleted successfully!';
				saveMessageType = 'success';
			} else {
				blogError = result.error || 'Failed to delete blog post';
			}
		} catch (error) {
			console.error('Error deleting blog post:', error);
			blogError = 'Failed to delete blog post';
		} finally {
			blogLoading = false;
		}
	}

	function cancelBlogEdit() {
		showBlogEditor = false;
		editingBlogPost = null;
		blogError = '';
	}

	function updateBlogTitle(title: string) {
		if (editingBlogPost) {
			editingBlogPost.title = title;
			// Auto-generate slug from title
			editingBlogPost.slug = generateSlug(title);
		}
	}

	// Image upload handler for hero section
	function handleHeroImageUpload(event: CustomEvent) {
		if (currentContent) {
			const { url } = event.detail;
			currentContent.hero.profileImage = url;
			handleChange();
		}
	}

	function handleHeroImageChange(event: CustomEvent) {
		if (currentContent) {
			const { url } = event.detail;
			currentContent.hero.profileImage = url;
			handleChange();
		}
	}

	// Existing functions (content management)
	async function updateContent() {
		if (!currentContent) return;

		isLoading = true;
		saveMessage = '';
		console.log('Admin: Saving content...', currentContent);

		try {
			const success = await content.update(currentContent);
			if (success) {
				isDirty = false;
				lastSaved = new Date();
				saveMessage = 'Content updated successfully!';
				saveMessageType = 'success';
				console.log('Admin: Content saved successfully');

				// Clear success message after 3 seconds
				setTimeout(() => {
					saveMessage = '';
				}, 3000);
			} else {
				saveMessage = 'Failed to update content. Please try again.';
				saveMessageType = 'error';
			}
		} catch (error) {
			console.error('Admin: Error updating content:', error);
			saveMessage = 'An error occurred while saving. Please try again.';
			saveMessageType = 'error';
		} finally {
			isLoading = false;
		}
	}

	async function refreshContent() {
		isLoading = true;
		try {
			const success = await content.refresh();
			if (success) {
				isDirty = false;
				saveMessage = 'Content refreshed from server!';
				saveMessageType = 'success';
				setTimeout(() => {
					saveMessage = '';
				}, 3000);
			} else {
				saveMessage = 'Failed to refresh content.';
				saveMessageType = 'error';
			}
		} catch (error) {
			console.error('Admin: Error refreshing content:', error);
			saveMessage = 'An error occurred while refreshing.';
			saveMessageType = 'error';
		} finally {
			isLoading = false;
		}
	}

	function handleChange() {
		isDirty = true;
		console.log('Admin: Content changed, marking as dirty');
	}

	function resetChanges() {
		// Get fresh data from store
		const unsubscribeReset = content.subscribe((value: Content | null) => {
			if (value) {
				currentContent = JSON.parse(JSON.stringify(value));
				isDirty = false;
				saveMessage = 'Changes reset to last saved version.';
				saveMessageType = 'success';
				setTimeout(() => {
					saveMessage = '';
				}, 3000);
			}
		});
		unsubscribeReset();
	}

	// Skills management
	function addSkill(category: string) {
		if (currentContent?.skills?.[category as keyof typeof currentContent.skills]) {
			(currentContent.skills[category as keyof typeof currentContent.skills] as Skill[]) = [
				...(currentContent.skills[category as keyof typeof currentContent.skills] as Skill[]),
				{ name: '', level: 50 }
			];
			handleChange();
		}
	}

	function removeSkill(category: string, index: number) {
		if (currentContent?.skills?.[category as keyof typeof currentContent.skills]) {
			(currentContent.skills[category as keyof typeof currentContent.skills] as Skill[]) = (
				currentContent.skills[category as keyof typeof currentContent.skills] as Skill[]
			).filter((_, i) => i !== index);
			handleChange();
		}
	}

	// Services management
	function addService() {
		if (!currentContent) return;
		currentContent.services = [
			...currentContent.services,
			{ title: '', description: '', icon: 'Star' }
		];
		handleChange();
	}

	function removeService(index: number) {
		if (!currentContent) return;
		currentContent.services = currentContent.services.filter((_, i) => i !== index);
		handleChange();
	}

	// Projects management
	function addProject() {
		if (!currentContent) return;
		currentContent.projects = [
			...currentContent.projects,
			{
				title: '',
				description: '',
				technologies: [],
				impact: '',
				link: '',
				image: ''
			}
		];
		handleChange();
	}

	function removeProject(index: number) {
		if (!currentContent) return;
		currentContent.projects = currentContent.projects.filter((_, i) => i !== index);
		handleChange();
	}

	function addTechnology(projectIndex: number) {
		if (!currentContent) return;
		currentContent.projects[projectIndex].technologies = [
			...currentContent.projects[projectIndex].technologies,
			''
		];
		handleChange();
	}

	function removeTechnology(projectIndex: number, techIndex: number) {
		if (!currentContent) return;
		currentContent.projects[projectIndex].technologies = currentContent.projects[
			projectIndex
		].technologies.filter((_, i) => i !== techIndex);
		handleChange();
	}

	// Experience management
	function addExperience() {
		if (!currentContent) return;
		currentContent.experience = [
			...currentContent.experience,
			{
				company: '',
				position: '',
				period: '',
				location: '',
				description: '',
				achievements: []
			}
		];
		handleChange();
	}

	function removeExperience(index: number) {
		if (!currentContent) return;
		currentContent.experience = currentContent.experience.filter((_, i) => i !== index);
		handleChange();
	}

	function addAchievement(expIndex: number) {
		if (!currentContent) return;
		currentContent.experience[expIndex].achievements = [
			...currentContent.experience[expIndex].achievements,
			''
		];
		handleChange();
	}

	function removeAchievement(expIndex: number, achIndex: number) {
		if (!currentContent) return;
		currentContent.experience[expIndex].achievements = currentContent.experience[
			expIndex
		].achievements.filter((_, i) => i !== achIndex);
		handleChange();
	}

	// About section list management
	function addToList(section: string, listType: 'technicalExpertise' | 'industryFocus') {
		if (!currentContent) return;
		currentContent.about[listType] = [...currentContent.about[listType], ''];
		handleChange();
	}

	function removeFromList(listType: 'technicalExpertise' | 'industryFocus', index: number) {
		if (!currentContent) return;
		currentContent.about[listType] = currentContent.about[listType].filter((_, i) => i !== index);
		handleChange();
	}

	onMount(() => {
		content.init();
		loadBlogPosts();
	});

	onDestroy(() => {
		unsubscribe();
	});
</script>

<!-- Header & Controls -->
<div
	class="sticky top-0 z-10 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85"
>
	<div class="container mx-auto max-w-7xl px-6 py-4">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-4">
				<div class="flex items-center gap-2">
					<Settings class="text-primary h-6 w-6" />
					<h1 class="text-2xl font-bold text-gray-900">Content Management System</h1>
				</div>
				<Badge variant={isDirty ? 'destructive' : 'secondary'} class="text-xs">
					{isDirty ? 'Unsaved Changes' : 'All Saved'}
				</Badge>
			</div>

			<div class="flex items-center gap-3">
				{#if lastSaved}
					<div class="flex items-center gap-1 text-sm text-gray-500">
						<Database class="h-4 w-4" />
						<span>Last saved: {lastSaved.toLocaleString()}</span>
					</div>
				{/if}

				<Button
					variant="outline"
					size="sm"
					onclick={refreshContent}
					disabled={isLoading}
					class="h-8"
				>
					<RefreshCw class="mr-2 h-3.5 w-3.5 {isLoading ? 'animate-spin' : ''}" />
					Refresh
				</Button>

				{#if isDirty}
					<Button variant="ghost" size="sm" onclick={resetChanges} disabled={isLoading}>
						<Undo2 class="h-4 w-4" />
						Reset
					</Button>
				{/if}

				<Button
					variant={isDirty ? 'default' : 'secondary'}
					size="sm"
					onclick={updateContent}
					disabled={!isDirty || isLoading}
					class="h-8 {isDirty ? 'bg-zinc-900 text-white hover:bg-zinc-800' : ''}"
				>
					{#if isLoading}
						<RefreshCw class="mr-2 h-3.5 w-3.5 animate-spin" />
						Saving...
					{:else if isDirty}
						<Save class="mr-2 h-3.5 w-3.5" />
						Save Changes
					{:else}
						<Eye class="mr-2 h-3.5 w-3.5" />
						Saved
					{/if}
				</Button>
			</div>
		</div>

		{#if saveMessage}
			<div
				class="mt-4 flex items-center gap-2 rounded-md px-3 py-2 text-sm {saveMessageType ===
				'success'
					? 'border border-zinc-200 bg-zinc-50 text-zinc-900'
					: 'border border-red-200 bg-red-50 text-red-900'}"
			>
				{saveMessage}
			</div>
		{/if}

		{#if isDirty}
			<div
				class="mt-4 flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900"
			>
				<div class="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500"></div>
				You have unsaved changes.
			</div>
		{/if}
	</div>
</div>

{#if currentContent}
	<div class="container mx-auto max-w-7xl px-6 py-6">
		<Tabs.Root value={activeTab} onValueChange={(value) => (activeTab = value)}>
			<Tabs.List class="mb-8 grid w-full grid-cols-5 gap-1 lg:grid-cols-9">
				<Tabs.Trigger value="hero" class="flex items-center gap-2 text-xs lg:text-sm">
					<User class="h-4 w-4" />
					<span class="hidden sm:inline">Hero</span>
				</Tabs.Trigger>
				<Tabs.Trigger value="stats" class="flex items-center gap-2 text-xs lg:text-sm">
					<BarChart3 class="h-4 w-4" />
					<span class="hidden sm:inline">Stats</span>
				</Tabs.Trigger>
				<Tabs.Trigger value="about" class="flex items-center gap-2 text-xs lg:text-sm">
					<FileText class="h-4 w-4" />
					<span class="hidden sm:inline">About</span>
				</Tabs.Trigger>
				<Tabs.Trigger value="services" class="flex items-center gap-2 text-xs lg:text-sm">
					<Briefcase class="h-4 w-4" />
					<span class="hidden sm:inline">Services</span>
				</Tabs.Trigger>
				<Tabs.Trigger value="projects" class="flex items-center gap-2 text-xs lg:text-sm">
					<FolderOpen class="h-4 w-4" />
					<span class="hidden sm:inline">Projects</span>
				</Tabs.Trigger>
				<Tabs.Trigger value="skills" class="flex items-center gap-2 text-xs lg:text-sm">
					<Cpu class="h-4 w-4" />
					<span class="hidden sm:inline">Skills</span>
				</Tabs.Trigger>
				<Tabs.Trigger value="experience" class="flex items-center gap-2 text-xs lg:text-sm">
					<Award class="h-4 w-4" />
					<span class="hidden sm:inline">Experience</span>
				</Tabs.Trigger>
				<Tabs.Trigger value="contact" class="flex items-center gap-2 text-xs lg:text-sm">
					<Mail class="h-4 w-4" />
					<span class="hidden sm:inline">Contact</span>
				</Tabs.Trigger>
				<Tabs.Trigger value="blog" class="flex items-center gap-2 text-xs lg:text-sm">
					<PenTool class="h-4 w-4" />
					<span class="hidden sm:inline">Blog</span>
				</Tabs.Trigger>
			</Tabs.List>

			<!-- Hero Section -->
			<Tabs.Content value="hero" class="space-y-6">
				<Card.Root class="border-0 shadow-lg">
					<Card.Header class="pb-2">
						<Card.Title class="text-lg font-semibold tracking-tight">Hero Section</Card.Title>
						<Card.Description>Customize the main introduction of your portfolio.</Card.Description>
					</Card.Header>
					<Card.Content class="pt-6">
						<div class="grid gap-6 lg:grid-cols-2">
							<div class="space-y-4">
								<div>
									<Label for="hero-title" class="text-sm font-medium text-gray-700"
										>Main Title</Label
									>
									<Input
										id="hero-title"
										bind:value={currentContent.hero.title}
										oninput={handleChange}
										placeholder="e.g., Data Analyst"
										class="mt-1"
									/>
								</div>
								<div>
									<Label for="hero-subtitle" class="text-sm font-medium text-gray-700"
										>Subtitle</Label
									>
									<Input
										id="hero-subtitle"
										bind:value={currentContent.hero.subtitle}
										oninput={handleChange}
										placeholder="e.g., Turning Numbers into Insights"
										class="mt-1"
									/>
								</div>
								<div>
									<Label for="hero-description" class="text-sm font-medium text-gray-700"
										>Description</Label
									>
									<Textarea
										id="hero-description"
										bind:value={currentContent.hero.description}
										oninput={handleChange}
										placeholder="Brief description of what you do..."
										class="mt-1 min-h-[100px]"
									/>
								</div>
							</div>
							<div class="space-y-4">
								<div>
									<Label class="mb-3 block text-sm font-medium text-gray-700">Profile Image</Label>
									<ImageUpload
										value={currentContent.hero.profileImage}
										placeholder="Upload your profile photo"
										aspectRatio="1:1"
										maxWidth={400}
										maxHeight={400}
										on:upload={handleHeroImageUpload}
										on:change={handleHeroImageChange}
										on:remove={() => {
											if (currentContent) {
												currentContent.hero.profileImage = '';
												handleChange();
											}
										}}
									/>
								</div>
							</div>
						</div>
					</Card.Content>
				</Card.Root>
			</Tabs.Content>

			<!-- Blog Section -->
			<Tabs.Content value="blog" class="space-y-6">
				{#if showBlogEditor && editingBlogPost}
					<!-- Blog Editor -->
					<Card.Root class="border-0 shadow-lg">
						<Card.Header>
							<div class="flex items-center justify-between">
								<div>
									<Card.Title class="text-lg font-semibold tracking-tight"
										>{editingBlogPost.id ? 'Edit Post' : 'Create New Post'}</Card.Title
									>
									<Card.Description>
										{editingBlogPost.id
											? 'Update your existing blog post.'
											: 'Draft a new blog post.'}
									</Card.Description>
								</div>
							</div>
						</Card.Header>
						<Card.Content class="space-y-6 pt-6">
							{#if blogError}
								<div class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800">
									{blogError}
								</div>
							{/if}

							<div class="grid gap-6 lg:grid-cols-2">
								<div class="space-y-4">
									<div>
										<Label for="blog-title" class="text-sm font-medium text-gray-700">Title</Label>
										<Input
											id="blog-title"
											bind:value={editingBlogPost.title}
											oninput={(e) => updateBlogTitle((e.target as HTMLInputElement).value)}
											placeholder="Enter your blog post title..."
											class="mt-1"
										/>
									</div>
									<div>
										<Label for="blog-slug" class="text-sm font-medium text-gray-700">URL Slug</Label
										>
										<Input
											id="blog-slug"
											bind:value={editingBlogPost.slug}
											placeholder="auto-generated-from-title"
											class="mt-1 font-mono text-sm"
										/>
									</div>
									<div>
										<Label for="blog-category" class="text-sm font-medium text-gray-700"
											>Category</Label
										>
										<Select.Root type="single" bind:value={editingBlogPost.category}>
											<Select.Trigger class="mt-1">
												{editingBlogPost.category
													? blogCategories[editingBlogPost.category]?.label
													: 'Select category'}
											</Select.Trigger>
											<Select.Content>
												{#each Object.entries(blogCategories) as [key, config] (key)}
													<Select.Item value={key} label={config.label}>{config.label}</Select.Item>
												{/each}
											</Select.Content>
										</Select.Root>
									</div>
									<div>
										<Label for="blog-status" class="text-sm font-medium text-gray-700">Status</Label
										>
										<Select.Root type="single" bind:value={editingBlogPost.status}>
											<Select.Trigger class="mt-1">
												{editingBlogPost.status
													? editingBlogPost.status.charAt(0).toUpperCase() +
														editingBlogPost.status.slice(1)
													: 'Select status'}
											</Select.Trigger>
											<Select.Content>
												<Select.Item value="draft" label="Draft">Draft</Select.Item>
												<Select.Item value="published" label="Published">Published</Select.Item>
												<Select.Item value="archived" label="Archived">Archived</Select.Item>
											</Select.Content>
										</Select.Root>
									</div>
								</div>
								<div class="space-y-4">
									<div>
										<Label for="blog-excerpt" class="text-sm font-medium text-gray-700"
											>Excerpt</Label
										>
										<Textarea
											id="blog-excerpt"
											bind:value={editingBlogPost.excerpt}
											placeholder="Brief description of your post (auto-generated if left empty)..."
											class="mt-1"
											rows={3}
										/>
									</div>
									<div>
										<Label for="blog-tags" class="text-sm font-medium text-gray-700"
											>Tags (comma separated)</Label
										>
										<Input
											id="blog-tags"
											value={editingBlogPost.tags.join(', ')}
											oninput={(e) => {
												if (editingBlogPost) {
													editingBlogPost.tags = (e.target as HTMLInputElement).value
														.split(',')
														.map((t) => t.trim())
														.filter((t) => t);
												}
											}}
											placeholder="travel, photography, adventure"
											class="mt-1"
										/>
									</div>
									<div>
										<Label for="blog-featured-image" class="text-sm font-medium text-gray-700"
											>Featured Image URL</Label
										>
										<Input
											id="blog-featured-image"
											bind:value={editingBlogPost.featured_image}
											placeholder="https://example.com/image.jpg"
											class="mt-1"
										/>
									</div>
									<div>
										<Label for="blog-meta" class="text-sm font-medium text-gray-700"
											>Meta Description</Label
										>
										<Textarea
											id="blog-meta"
											bind:value={editingBlogPost.meta_description}
											placeholder="SEO description for search engines..."
											class="mt-1"
											rows={2}
										/>
									</div>
								</div>
							</div>

							<div>
								<Label class="mb-3 block text-sm font-medium text-gray-700">Content</Label>
								<RichTextEditor
									bind:content={editingBlogPost.content}
									placeholder="Start writing your blog post..."
								/>
							</div>

							<div class="flex gap-3 border-t pt-4">
								<Button onclick={saveBlogPost} disabled={blogLoading}>
									{#if blogLoading}
										<RefreshCw class="mr-2 h-4 w-4 animate-spin" />
										Saving...
									{:else}
										<Save class="mr-2 h-4 w-4" />
										Save Blog Post
									{/if}
								</Button>
								<Button variant="outline" onclick={cancelBlogEdit}>Cancel</Button>
							</div>
						</Card.Content>
					</Card.Root>
				{:else}
					<!-- Blog List Table View -->
					<div class="space-y-4">
						<div class="flex items-center justify-between">
							<div>
								<h2 class="text-lg font-semibold tracking-tight">Blog Posts</h2>
								<p class="text-sm text-gray-500">Manage, edit, and publish your content.</p>
							</div>
							<Button onclick={startNewBlogPost} size="sm" class="h-8">
								<Plus class="mr-2 h-3.5 w-3.5" />
								New Post
							</Button>
						</div>

						<Card.Root>
							<Card.Content class="p-0">
								<!-- Filters Bar -->
								<div class="flex flex-wrap gap-4 border-b p-4">
									<div class="flex items-center gap-2">
										<Search class="h-4 w-4 text-gray-400" />
										<Input placeholder="Search posts..." class="h-8 w-[200px] lg:w-[300px]" />
									</div>
									<Select.Root
										type="single"
										bind:value={blogFilters.category}
										onValueChange={() => loadBlogPosts()}
									>
										<Select.Trigger class="h-8 w-[150px]">
											{blogFilters.category
												? blogCategories[blogFilters.category]?.label
												: 'Category'}
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
										<Select.Trigger class="h-8 w-[120px]">
											{blogFilters.status
												? blogFilters.status.charAt(0).toUpperCase() + blogFilters.status.slice(1)
												: 'Status'}
										</Select.Trigger>
										<Select.Content>
											<Select.Item value="" label="All Statuses">All Statuses</Select.Item>
											<Select.Item value="draft" label="Draft">Draft</Select.Item>
											<Select.Item value="published" label="Published">Published</Select.Item>
											<Select.Item value="archived" label="Archived">Archived</Select.Item>
										</Select.Content>
									</Select.Root>
									<div class="ml-auto">
										<Button
											variant="ghost"
											size="icon"
											onclick={loadBlogPosts}
											disabled={blogLoading}
											class="h-8 w-8"
										>
											<RefreshCw class="h-3.5 w-3.5 {blogLoading ? 'animate-spin' : ''}" />
										</Button>
									</div>
								</div>

								{#if blogLoading}
									<div class="py-12 text-center">
										<div
											class="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-zinc-900 border-t-transparent"
										></div>
									</div>
								{:else if blogPosts.length === 0}
									<div class="py-12 text-center">
										<FileText class="mx-auto h-10 w-10 text-gray-300" />
										<h3 class="mt-4 text-sm font-medium text-gray-900">No posts found</h3>
										<p class="mt-1 text-sm text-gray-500">
											Get started by creating your first blog post.
										</p>
									</div>
								{:else}
									<Table.Root>
										<Table.Header>
											<Table.Row>
												<Table.Head class="w-[400px]">Title</Table.Head>
												<Table.Head>Status</Table.Head>
												<Table.Head>Category</Table.Head>
												<Table.Head>Views</Table.Head>
												<Table.Head class="text-right">Created</Table.Head>
												<Table.Head class="w-[50px]"></Table.Head>
											</Table.Row>
										</Table.Header>
										<Table.Body>
											{#each blogPosts as post (post.id)}
												<Table.Row class="group">
													<Table.Cell class="font-medium">
														<div class="flex flex-col">
															<span class="truncate">{post.title}</span>
															<span
																class="max-w-[300px] truncate text-xs font-normal text-gray-500"
															>
																/{post.slug}
															</span>
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
														<Badge variant="outline" class="text-xs font-normal">
															{blogCategories[post.category].label}
														</Badge>
													</Table.Cell>
													<Table.Cell>
														<span class="text-xs text-gray-500">{post.views || 0}</span>
													</Table.Cell>
													<Table.Cell class="text-right">
														<span class="text-xs text-gray-500">
															{new Date(post.created_at || '').toLocaleDateString()}
														</span>
													</Table.Cell>
													<Table.Cell>
														<DropdownMenu.Root>
															<DropdownMenu.Trigger asChild let:builder>
																<Button
																	builders={[builder]}
																	variant="ghost"
																	size="icon"
																	class="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
																>
																	<MoreHorizontal class="h-3.5 w-3.5" />
																</Button>
															</DropdownMenu.Trigger>
															<DropdownMenu.Content align="end">
																<DropdownMenu.Item onclick={() => editBlogPost(post)}>
																	<Edit class="mr-2 h-3.5 w-3.5" />
																	Edit
																</DropdownMenu.Item>
																<DropdownMenu.Item
																	onclick={() => deleteBlogPostConfirm(post)}
																	class="text-red-600 focus:text-red-600"
																>
																	<Trash2 class="mr-2 h-3.5 w-3.5" />
																	Delete
																</DropdownMenu.Item>
															</DropdownMenu.Content>
														</DropdownMenu.Root>
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
			</Tabs.Content>

			<!-- Stats Section -->
			<Tabs.Content value="stats" class="space-y-6">
				<Card.Root class="border-0 shadow-lg">
					<Card.Header class="pb-2">
						<Card.Title class="text-lg font-semibold tracking-tight">Statistics</Card.Title>
						<Card.Description>
							Key numbers that showcase your experience and achievements
						</Card.Description>
					</Card.Header>
					<Card.Content class="pt-6">
						<div class="grid gap-6 lg:grid-cols-3">
							<div>
								<Label for="years-experience" class="text-sm font-medium text-gray-700"
									>Years of Experience</Label
								>
								<Input
									id="years-experience"
									type="number"
									bind:value={currentContent.stats.yearsExperience}
									oninput={handleChange}
									placeholder="5"
									class="mt-1"
								/>
							</div>
							<div>
								<Label for="projects-completed" class="text-sm font-medium text-gray-700"
									>Projects Completed</Label
								>
								<Input
									id="projects-completed"
									type="number"
									bind:value={currentContent.stats.projectsCompleted}
									oninput={handleChange}
									placeholder="25"
									class="mt-1"
								/>
							</div>
							<div>
								<Label for="satisfied-clients" class="text-sm font-medium text-gray-700"
									>Satisfied Clients</Label
								>
								<Input
									id="satisfied-clients"
									type="number"
									bind:value={currentContent.stats.satisfiedClients}
									oninput={handleChange}
									placeholder="15"
									class="mt-1"
								/>
							</div>
						</div>
					</Card.Content>
				</Card.Root>
			</Tabs.Content>

			<!-- About Section -->
			<Tabs.Content value="about" class="space-y-6">
				<Card.Root class="border-0 shadow-lg">
					<Card.Header class="pb-2">
						<Card.Title class="text-lg font-semibold tracking-tight">About Section</Card.Title>
						<Card.Description>Tell your story and highlight your expertise</Card.Description>
					</Card.Header>
					<Card.Content class="pt-6">
						<div class="space-y-6">
							<div>
								<Label for="about-description" class="text-sm font-medium text-gray-700"
									>Description</Label
								>
								<Textarea
									id="about-description"
									bind:value={currentContent.about.description}
									oninput={handleChange}
									placeholder="Write about yourself, your background, and what drives you..."
									class="mt-1 min-h-[120px]"
								/>
							</div>

							<div class="grid gap-6 lg:grid-cols-2">
								<!-- Technical Expertise -->
								<div>
									<div class="mb-4 flex items-center justify-between">
										<Label class="text-sm font-medium text-gray-700">Technical Expertise</Label>
										<Button
											size="sm"
											variant="outline"
											onclick={() => addToList('about', 'technicalExpertise')}
										>
											<Plus class="h-4 w-4" />
											Add
										</Button>
									</div>
									<div class="space-y-3">
										{#each currentContent.about.technicalExpertise as _, index (index)}
											<div class="flex gap-2">
												<Input
													bind:value={currentContent.about.technicalExpertise[index]}
													oninput={handleChange}
													placeholder="e.g., Advanced Excel & Power BI"
													class="flex-1"
												/>
												<Button
													size="sm"
													variant="ghost"
													onclick={() => removeFromList('technicalExpertise', index)}
													class="text-red-600 hover:bg-red-50 hover:text-red-700"
												>
													<Trash2 class="h-4 w-4" />
												</Button>
											</div>
										{/each}
									</div>
								</div>

								<!-- Industry Focus -->
								<div>
									<div class="mb-4 flex items-center justify-between">
										<Label class="text-sm font-medium text-gray-700">Industry Focus</Label>
										<Button
											size="sm"
											variant="outline"
											onclick={() => addToList('about', 'industryFocus')}
										>
											<Plus class="h-4 w-4" />
											Add
										</Button>
									</div>
									<div class="space-y-3">
										{#each currentContent.about.industryFocus as _, index (index)}
											<div class="flex gap-2">
												<Input
													bind:value={currentContent.about.industryFocus[index]}
													oninput={handleChange}
													placeholder="e.g., Financial Services"
													class="flex-1"
												/>
												<Button
													size="sm"
													variant="ghost"
													onclick={() => removeFromList('industryFocus', index)}
													class="text-red-600 hover:bg-red-50 hover:text-red-700"
												>
													<Trash2 class="h-4 w-4" />
												</Button>
											</div>
										{/each}
									</div>
								</div>
							</div>
						</div>
					</Card.Content>
				</Card.Root>
			</Tabs.Content>

			<!-- Services Section -->
			<Tabs.Content value="services" class="space-y-6">
				<Card.Root class="border-0 shadow-lg">
					<Card.Header class="pb-2">
						<Card.Title class="text-lg font-semibold tracking-tight">Services</Card.Title>
						<Card.Description>The services you offer to clients</Card.Description>
					</Card.Header>
					<Card.Content class="pt-6">
						<div class="mb-6">
							<Button onclick={addService} class="bg-orange-600 hover:bg-orange-700">
								<Plus class="h-4 w-4" />
								Add Service
							</Button>
						</div>

						<div class="space-y-6">
							{#each currentContent.services as service, index (index)}
								<Card.Root class="border border-gray-200">
									<Card.Header class="pb-3">
										<div class="flex items-center justify-between">
											<Card.Title class="text-lg">Service {index + 1}</Card.Title>
											<Button
												size="sm"
												variant="ghost"
												onclick={() => removeService(index)}
												class="text-red-600 hover:bg-red-50 hover:text-red-700"
											>
												<Trash2 class="h-4 w-4" />
												Remove
											</Button>
										</div>
									</Card.Header>
									<Card.Content>
										<div class="grid gap-4 lg:grid-cols-3">
											<div>
												<Label for="service-title-{index}" class="text-sm font-medium text-gray-700"
													>Service Title</Label
												>
												<Input
													id="service-title-{index}"
													bind:value={service.title}
													oninput={handleChange}
													placeholder="e.g., Data Analysis"
													class="mt-1"
												/>
											</div>
											<div>
												<Label for="service-icon-{index}" class="text-sm font-medium text-gray-700"
													>Icon (Lucide name)</Label
												>
												<Input
													id="service-icon-{index}"
													bind:value={service.icon}
													oninput={handleChange}
													placeholder="e.g., BarChart3"
													class="mt-1"
												/>
											</div>
											<div>
												<Label
													for="service-description-{index}"
													class="text-sm font-medium text-gray-700">Description</Label
												>
												<Textarea
													id="service-description-{index}"
													bind:value={service.description}
													oninput={handleChange}
													placeholder="Brief description of this service..."
													class="mt-1 min-h-[80px]"
												/>
											</div>
										</div>
									</Card.Content>
								</Card.Root>
							{/each}
						</div>
					</Card.Content>
				</Card.Root>
			</Tabs.Content>

			<!-- Projects Section -->
			<Tabs.Content value="projects" class="space-y-6">
				<Card.Root class="border-0 shadow-lg">
					<Card.Header class="pb-2">
						<Card.Title class="text-lg font-semibold tracking-tight">Projects</Card.Title>
						<Card.Description>Showcase your best work and achievements</Card.Description>
					</Card.Header>
					<Card.Content class="pt-6">
						<div class="mb-6">
							<Button onclick={addProject} class="bg-cyan-600 hover:bg-cyan-700">
								<Plus class="h-4 w-4" />
								Add Project
							</Button>
						</div>

						<div class="space-y-6">
							{#each currentContent.projects as project, index (index)}
								<Card.Root class="border border-gray-200">
									<Card.Header class="pb-3">
										<div class="flex items-center justify-between">
											<Card.Title class="text-lg">Project {index + 1}</Card.Title>
											<Button
												size="sm"
												variant="ghost"
												onclick={() => removeProject(index)}
												class="text-red-600 hover:bg-red-50 hover:text-red-700"
											>
												<Trash2 class="h-4 w-4" />
												Remove
											</Button>
										</div>
									</Card.Header>
									<Card.Content>
										<div class="space-y-4">
											<div class="grid gap-4 lg:grid-cols-2">
												<div>
													<Label
														for="project-title-{index}"
														class="text-sm font-medium text-gray-700">Project Title</Label
													>
													<Input
														id="project-title-{index}"
														bind:value={project.title}
														oninput={handleChange}
														placeholder="e.g., Sales Dashboard Analytics"
														class="mt-1"
													/>
												</div>
												<div>
													<Label
														for="project-impact-{index}"
														class="text-sm font-medium text-gray-700">Business Impact</Label
													>
													<Input
														id="project-impact-{index}"
														bind:value={project.impact}
														oninput={handleChange}
														placeholder="e.g., 15% increase in sales efficiency"
														class="mt-1"
													/>
												</div>
												<div>
													<Label
														for="project-link-{index}"
														class="text-sm font-medium text-gray-700">Project Link</Label
													>
													<Input
														id="project-link-{index}"
														bind:value={project.link}
														oninput={handleChange}
														placeholder="https://..."
														class="mt-1"
													/>
												</div>
												<div>
													<Label
														for="project-image-{index}"
														class="text-sm font-medium text-gray-700">Image URL</Label
													>
													<Input
														id="project-image-{index}"
														bind:value={project.image}
														oninput={handleChange}
														placeholder="/project-image.jpg"
														class="mt-1"
													/>
												</div>
											</div>
											<div>
												<Label
													for="project-description-{index}"
													class="text-sm font-medium text-gray-700">Description</Label
												>
												<Textarea
													id="project-description-{index}"
													bind:value={project.description}
													oninput={handleChange}
													placeholder="Detailed description of the project and your role..."
													class="mt-1 min-h-[100px]"
												/>
											</div>
											<div>
												<div class="mb-3 flex items-center justify-between">
													<Label class="text-sm font-medium text-gray-700">Technologies Used</Label>
													<Button size="sm" variant="outline" onclick={() => addTechnology(index)}>
														<Plus class="h-4 w-4" />
														Add Technology
													</Button>
												</div>
												<div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
													{#each project.technologies as _, techIndex (techIndex)}
														<div class="flex gap-2">
															<Input
																bind:value={project.technologies[techIndex]}
																oninput={handleChange}
																placeholder="e.g., Python"
																class="flex-1"
															/>
															<Button
																size="sm"
																variant="ghost"
																onclick={() => removeTechnology(index, techIndex)}
																class="text-red-600 hover:bg-red-50 hover:text-red-700"
															>
																<Trash2 class="h-4 w-4" />
															</Button>
														</div>
													{/each}
												</div>
											</div>
										</div>
									</Card.Content>
								</Card.Root>
							{/each}
						</div>
					</Card.Content>
				</Card.Root>
			</Tabs.Content>

			<!-- Skills Section -->
			<Tabs.Content value="skills" class="space-y-6">
				<Card.Root class="border-0 shadow-lg">
					<Card.Header class="pb-2">
						<Card.Title class="text-lg font-semibold tracking-tight"
							>Skills & Proficiency</Card.Title
						>
						<Card.Description>Your technical skills and expertise levels</Card.Description>
					</Card.Header>
					<Card.Content class="pt-6">
						<div class="grid gap-6 lg:grid-cols-2">
							{#each Object.entries(currentContent.skills) as [category, skillList] (category)}
								<Card.Root class="border border-gray-200">
									<Card.Header class="pb-3">
										<div class="flex items-center justify-between">
											<Card.Title class="text-lg capitalize"
												>{category.replace(/([A-Z])/g, ' $1').trim()}</Card.Title
											>
											<Button size="sm" variant="outline" onclick={() => addSkill(category)}>
												<Plus class="h-4 w-4" />
												Add
											</Button>
										</div>
									</Card.Header>
									<Card.Content>
										<div class="space-y-4">
											{#each skillList as skill, index (index)}
												<div class="space-y-2">
													<div class="flex gap-2">
														<Input
															bind:value={skill.name}
															oninput={handleChange}
															placeholder="Skill name"
															class="flex-1"
														/>
														<Button
															size="sm"
															variant="ghost"
															onclick={() => removeSkill(category, index)}
															class="text-red-600 hover:bg-red-50 hover:text-red-700"
														>
															<Trash2 class="h-4 w-4" />
														</Button>
													</div>
													<div class="flex items-center gap-3">
														<Label class="min-w-[70px] text-sm text-gray-600"
															>Level: {skill.level}%</Label
														>
														<input
															type="range"
															min="0"
															max="100"
															bind:value={skill.level}
															oninput={handleChange}
															class="slider h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-200"
														/>
													</div>
												</div>
											{/each}
										</div>
									</Card.Content>
								</Card.Root>
							{/each}
						</div>
					</Card.Content>
				</Card.Root>
			</Tabs.Content>

			<!-- Experience Section -->
			<Tabs.Content value="experience" class="space-y-6">
				<Card.Root class="border-0 shadow-lg">
					<Card.Header class="pb-2">
						<Card.Title class="text-lg font-semibold tracking-tight">Work Experience</Card.Title>
						<Card.Description>Your professional experience and achievements</Card.Description>
					</Card.Header>
					<Card.Content class="pt-6">
						<div class="mb-6">
							<Button onclick={addExperience} class="bg-green-600 hover:bg-green-700">
								<Plus class="h-4 w-4" />
								Add Experience
							</Button>
						</div>

						<div class="space-y-6">
							{#each currentContent.experience as exp, index (index)}
								<Card.Root class="border border-gray-200">
									<Card.Header class="pb-3">
										<div class="flex items-center justify-between">
											<Card.Title class="text-lg">Experience {index + 1}</Card.Title>
											<Button
												size="sm"
												variant="ghost"
												onclick={() => removeExperience(index)}
												class="text-red-600 hover:bg-red-50 hover:text-red-700"
											>
												<Trash2 class="h-4 w-4" />
												Remove
											</Button>
										</div>
									</Card.Header>
									<Card.Content>
										<div class="space-y-4">
											<div class="grid gap-4 lg:grid-cols-2">
												<div>
													<Label for="exp-company-{index}" class="text-sm font-medium text-gray-700"
														>Company</Label
													>
													<Input
														id="exp-company-{index}"
														bind:value={exp.company}
														oninput={handleChange}
														placeholder="e.g., Tech Corp"
														class="mt-1"
													/>
												</div>
												<div>
													<Label
														for="exp-position-{index}"
														class="text-sm font-medium text-gray-700">Position</Label
													>
													<Input
														id="exp-position-{index}"
														bind:value={exp.position}
														oninput={handleChange}
														placeholder="e.g., Senior Data Analyst"
														class="mt-1"
													/>
												</div>
												<div>
													<Label for="exp-period-{index}" class="text-sm font-medium text-gray-700"
														>Period</Label
													>
													<Input
														id="exp-period-{index}"
														bind:value={exp.period}
														oninput={handleChange}
														placeholder="e.g., 2020 - Present"
														class="mt-1"
													/>
												</div>
												<div>
													<Label
														for="exp-location-{index}"
														class="text-sm font-medium text-gray-700">Location</Label
													>
													<Input
														id="exp-location-{index}"
														bind:value={exp.location}
														oninput={handleChange}
														placeholder="e.g., New York, NY"
														class="mt-1"
													/>
												</div>
											</div>
											<div>
												<Label
													for="exp-description-{index}"
													class="text-sm font-medium text-gray-700">Description</Label
												>
												<Textarea
													id="exp-description-{index}"
													bind:value={exp.description}
													oninput={handleChange}
													placeholder="Brief description of your role and responsibilities..."
													class="mt-1 min-h-[100px]"
												/>
											</div>
											<div>
												<div class="mb-3 flex items-center justify-between">
													<Label class="text-sm font-medium text-gray-700">Key Achievements</Label>
													<Button size="sm" variant="outline" onclick={() => addAchievement(index)}>
														<Plus class="h-4 w-4" />
														Add Achievement
													</Button>
												</div>
												<div class="space-y-2">
													{#each exp.achievements as _, achIndex (achIndex)}
														<div class="flex gap-2">
															<Input
																bind:value={exp.achievements[achIndex]}
																oninput={handleChange}
																placeholder="e.g., Improved process efficiency by 25%"
																class="flex-1"
															/>
															<Button
																size="sm"
																variant="ghost"
																onclick={() => removeAchievement(index, achIndex)}
																class="text-red-600 hover:bg-red-50 hover:text-red-700"
															>
																<Trash2 class="h-4 w-4" />
															</Button>
														</div>
													{/each}
												</div>
											</div>
										</div>
									</Card.Content>
								</Card.Root>
							{/each}
						</div>
					</Card.Content>
				</Card.Root>
			</Tabs.Content>

			<!-- Contact Section -->
			<Tabs.Content value="contact" class="space-y-6">
				<Card.Root class="border-0 shadow-lg">
					<Card.Header class="pb-2">
						<Card.Title class="text-lg font-semibold tracking-tight">Contact Information</Card.Title
						>
						<Card.Description>How people can reach you and connect with you</Card.Description>
					</Card.Header>
					<Card.Content class="pt-6">
						<div class="grid gap-6 lg:grid-cols-2">
							<div>
								<Label for="contact-email" class="text-sm font-medium text-gray-700"
									>Email Address</Label
								>
								<Input
									id="contact-email"
									type="email"
									bind:value={currentContent.contact.email}
									oninput={handleChange}
									placeholder="your.email@example.com"
									class="mt-1"
								/>
							</div>
							<div>
								<Label for="contact-phone" class="text-sm font-medium text-gray-700"
									>Phone Number</Label
								>
								<Input
									id="contact-phone"
									bind:value={currentContent.contact.phone}
									oninput={handleChange}
									placeholder="+1 (555) 123-4567"
									class="mt-1"
								/>
							</div>
							<div>
								<Label for="contact-location" class="text-sm font-medium text-gray-700"
									>Location</Label
								>
								<Input
									id="contact-location"
									bind:value={currentContent.contact.location}
									oninput={handleChange}
									placeholder="City, State/Country"
									class="mt-1"
								/>
							</div>
							<div>
								<Label for="contact-github" class="text-sm font-medium text-gray-700"
									>GitHub Profile</Label
								>
								<Input
									id="contact-github"
									bind:value={currentContent.contact.github}
									oninput={handleChange}
									placeholder="https://github.com/username"
									class="mt-1"
								/>
							</div>
							<div class="lg:col-span-2">
								<Label for="contact-linkedin" class="text-sm font-medium text-gray-700"
									>LinkedIn Profile</Label
								>
								<Input
									id="contact-linkedin"
									bind:value={currentContent.contact.linkedin}
									oninput={handleChange}
									placeholder="https://linkedin.com/in/username"
									class="mt-1"
								/>
							</div>
						</div>
					</Card.Content>
				</Card.Root>
			</Tabs.Content>
		</Tabs.Root>
	</div>
{:else}
	<div class="container mx-auto px-6 py-12">
		<div class="flex min-h-64 items-center justify-center">
			<div class="text-center">
				<div
					class="mx-auto mb-6 h-16 w-16 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"
				></div>
				<h3 class="mb-2 text-lg font-medium text-gray-900">Loading Content...</h3>
				<p class="text-gray-500">Please wait while we fetch your portfolio data.</p>
			</div>
		</div>
	</div>
{/if}

<style>
	.slider::-webkit-slider-thumb {
		appearance: none;
		height: 20px;
		width: 20px;
		border-radius: 50%;
		background: #3b82f6;
		cursor: pointer;
		border: 2px solid white;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.slider::-moz-range-thumb {
		height: 20px;
		width: 20px;
		border-radius: 50%;
		background: #3b82f6;
		cursor: pointer;
		border: 2px solid white;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}
</style>
