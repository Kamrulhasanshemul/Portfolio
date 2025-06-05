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
	import ImageUpload from '$lib/components/ImageUpload.svelte';
	import RichTextEditor from '$lib/components/RichTextEditor.svelte';
	import { onMount, onDestroy } from 'svelte';
	import type { Content } from '$lib/types/content';
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
		Globe,
		Archive,
		Copy,
		ExternalLink
	} from 'lucide-svelte';

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
		if (!confirm(`Are you sure you want to delete "${post.title}"? This action cannot be undone.`)) {
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
			(currentContent.skills[category as keyof typeof currentContent.skills] as any[]) = [
				...(currentContent.skills[category as keyof typeof currentContent.skills] as any[]),
				{ name: '', level: 50 }
			];
			handleChange();
		}
	}

	function removeSkill(category: string, index: number) {
		if (currentContent?.skills?.[category as keyof typeof currentContent.skills]) {
			(currentContent.skills[category as keyof typeof currentContent.skills] as any[]) = (
				currentContent.skills[category as keyof typeof currentContent.skills] as any[]
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
<div class="sticky top-0 z-10 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
	<div class="container mx-auto max-w-7xl px-6 py-4">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-4">
				<div class="flex items-center gap-2">
					<Settings class="h-6 w-6 text-primary" />
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
				
				<Button variant="outline" size="sm" onclick={refreshContent} disabled={isLoading}>
					<RefreshCw class="h-4 w-4 {isLoading ? 'animate-spin' : ''}" />
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
					class={isDirty ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
				>
					{#if isLoading}
						<RefreshCw class="h-4 w-4 animate-spin" />
						Saving...
					{:else if isDirty}
						<Save class="h-4 w-4" />
						Save Changes
					{:else}
						<Eye class="h-4 w-4" />
						All Saved
					{/if}
				</Button>
			</div>
		</div>

		{#if saveMessage}
			<div class="mt-3 flex items-center gap-2 rounded-lg px-4 py-2 text-sm {saveMessageType === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}">
				{saveMessage}
			</div>
		{/if}

		{#if isDirty}
			<div class="mt-3 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-800">
				<div class="h-2 w-2 animate-pulse rounded-full bg-amber-500"></div>
				You have unsaved changes. Click "Save Changes" to apply them to the live site.
			</div>
		{/if}
	</div>
</div>

{#if currentContent}
	<div class="container mx-auto max-w-7xl px-6 py-6">
		<Tabs.Root value={activeTab} onValueChange={(value) => activeTab = value}>
			<Tabs.List class="grid w-full grid-cols-5 gap-1 lg:grid-cols-9 mb-8">
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
					<Card.Header class="border-b bg-gradient-to-r from-blue-50 to-indigo-50">
						<Card.Title class="flex items-center gap-2 text-xl">
							<User class="h-5 w-5 text-blue-600" />
							Hero Section
						</Card.Title>
						<Card.Description>
							The main introduction section visible on your homepage
						</Card.Description>
					</Card.Header>
					<Card.Content class="pt-6">
						<div class="grid gap-6 lg:grid-cols-2">
							<div class="space-y-4">
								<div>
									<Label for="hero-title" class="text-sm font-medium text-gray-700">Main Title</Label>
									<Input
										id="hero-title"
										bind:value={currentContent.hero.title}
										oninput={handleChange}
										placeholder="e.g., Data Analyst"
										class="mt-1"
									/>
								</div>
								<div>
									<Label for="hero-subtitle" class="text-sm font-medium text-gray-700">Subtitle</Label>
									<Input
										id="hero-subtitle"
										bind:value={currentContent.hero.subtitle}
										oninput={handleChange}
										placeholder="e.g., Turning Numbers into Insights"
										class="mt-1"
									/>
								</div>
								<div>
									<Label for="hero-description" class="text-sm font-medium text-gray-700">Description</Label>
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
									<Label class="text-sm font-medium text-gray-700 mb-3 block">Profile Image</Label>
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
						<Card.Header class="border-b bg-gradient-to-r from-purple-50 to-indigo-50">
							<Card.Title class="flex items-center gap-2 text-xl">
								<Edit class="h-5 w-5 text-purple-600" />
								{editingBlogPost.id ? 'Edit Blog Post' : 'Create New Blog Post'}
							</Card.Title>
							<Card.Description>
								Write and publish your blog posts with rich formatting
							</Card.Description>
						</Card.Header>
						<Card.Content class="pt-6 space-y-6">
							{#if blogError}
								<div class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
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
										<Label for="blog-slug" class="text-sm font-medium text-gray-700">URL Slug</Label>
										<Input
											id="blog-slug"
											bind:value={editingBlogPost.slug}
											placeholder="auto-generated-from-title"
											class="mt-1 font-mono text-sm"
										/>
									</div>
									<div>
										<Label for="blog-category" class="text-sm font-medium text-gray-700">Category</Label>
																			<Select.Root 
										type="single"
										bind:value={editingBlogPost.category}
									>
											<Select.Trigger class="mt-1">
												{editingBlogPost.category ? blogCategories[editingBlogPost.category]?.label : "Select category"}
											</Select.Trigger>
											<Select.Content>
												{#each Object.entries(blogCategories) as [key, config]}
													<Select.Item value={key} label={config.label}>{config.label}</Select.Item>
												{/each}
											</Select.Content>
										</Select.Root>
									</div>
									<div>
										<Label for="blog-status" class="text-sm font-medium text-gray-700">Status</Label>
																			<Select.Root 
										type="single"
										bind:value={editingBlogPost.status}
									>
											<Select.Trigger class="mt-1">
												{editingBlogPost.status ? editingBlogPost.status.charAt(0).toUpperCase() + editingBlogPost.status.slice(1) : "Select status"}
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
										<Label for="blog-excerpt" class="text-sm font-medium text-gray-700">Excerpt</Label>
										<Textarea
											id="blog-excerpt"
											bind:value={editingBlogPost.excerpt}
											placeholder="Brief description of your post (auto-generated if left empty)..."
											class="mt-1"
											rows={3}
										/>
									</div>
									<div>
										<Label for="blog-tags" class="text-sm font-medium text-gray-700">Tags (comma separated)</Label>
										<Input
											id="blog-tags"
											value={editingBlogPost.tags.join(', ')}
											oninput={(e) => {
												if (editingBlogPost) {
													editingBlogPost.tags = (e.target as HTMLInputElement).value.split(',').map(t => t.trim()).filter(t => t);
												}
											}}
											placeholder="travel, photography, adventure"
											class="mt-1"
										/>
									</div>
									<div>
										<Label for="blog-featured-image" class="text-sm font-medium text-gray-700">Featured Image URL</Label>
										<Input
											id="blog-featured-image"
											bind:value={editingBlogPost.featured_image}
											placeholder="https://example.com/image.jpg"
											class="mt-1"
										/>
									</div>
									<div>
										<Label for="blog-meta" class="text-sm font-medium text-gray-700">Meta Description</Label>
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
								<Label class="text-sm font-medium text-gray-700 mb-3 block">Content</Label>
								<RichTextEditor
									bind:content={editingBlogPost.content}
									placeholder="Start writing your blog post..."
								/>
							</div>
							
							<div class="flex gap-3 pt-4 border-t">
								<Button onclick={saveBlogPost} disabled={blogLoading}>
									{#if blogLoading}
										<RefreshCw class="h-4 w-4 animate-spin mr-2" />
										Saving...
									{:else}
										<Save class="h-4 w-4 mr-2" />
										Save Blog Post
									{/if}
								</Button>
								<Button variant="outline" onclick={cancelBlogEdit}>
									Cancel
								</Button>
							</div>
						</Card.Content>
					</Card.Root>
				{:else}
					<!-- Blog List -->
					<Card.Root class="border-0 shadow-lg">
						<Card.Header class="border-b bg-gradient-to-r from-purple-50 to-pink-50">
							<div class="flex items-center justify-between">
								<div>
									<Card.Title class="flex items-center gap-2 text-xl">
										<PenTool class="h-5 w-5 text-purple-600" />
										Blog Management
									</Card.Title>
									<Card.Description>
										Create and manage your blog posts with categories like personal, travel, tech, and journey
									</Card.Description>
								</div>
								<Button onclick={startNewBlogPost}>
									<Plus class="h-4 w-4 mr-2" />
									New Post
								</Button>
							</div>
						</Card.Header>
						<Card.Content class="pt-6">
							{#if blogError}
								<div class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
									{blogError}
								</div>
							{/if}
							
							<!-- Filters -->
							<div class="flex gap-4 mb-6 flex-wrap">
								<div>
									<Label class="text-sm font-medium text-gray-700">Filter by Category</Label>
									<Select.Root 
										type="single"
										bind:value={blogFilters.category}
										onValueChange={() => loadBlogPosts()}
									>
										<Select.Trigger class="mt-1 w-48">
											{blogFilters.category ? blogCategories[blogFilters.category]?.label : "All Categories"}
										</Select.Trigger>
										<Select.Content>
											<Select.Item value="" label="All Categories">All Categories</Select.Item>
											{#each Object.entries(blogCategories) as [key, config]}
												<Select.Item value={key} label={config.label}>{config.label}</Select.Item>
											{/each}
										</Select.Content>
									</Select.Root>
								</div>
								<div>
									<Label class="text-sm font-medium text-gray-700">Filter by Status</Label>
									<Select.Root 
										type="single"
										bind:value={blogFilters.status}
										onValueChange={() => loadBlogPosts()}
									>
										<Select.Trigger class="mt-1 w-48">
											{blogFilters.status ? blogFilters.status.charAt(0).toUpperCase() + blogFilters.status.slice(1) : "All Statuses"}
										</Select.Trigger>
										<Select.Content>
											<Select.Item value="" label="All Statuses">All Statuses</Select.Item>
											<Select.Item value="draft" label="Draft">Draft</Select.Item>
											<Select.Item value="published" label="Published">Published</Select.Item>
											<Select.Item value="archived" label="Archived">Archived</Select.Item>
										</Select.Content>
									</Select.Root>
								</div>
								<div class="flex items-end">
									<Button variant="outline" onclick={loadBlogPosts} disabled={blogLoading}>
										<RefreshCw class="h-4 w-4 mr-2 {blogLoading ? 'animate-spin' : ''}" />
										Refresh
									</Button>
								</div>
							</div>
							
							{#if blogLoading}
								<div class="text-center py-12">
									<div class="animate-spin mx-auto w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
									<p class="mt-2 text-gray-600">Loading blog posts...</p>
								</div>
							{:else if blogPosts.length === 0}
								<div class="text-center py-12">
									<PenTool class="mx-auto h-12 w-12 text-gray-400" />
									<h3 class="mt-4 text-lg font-medium text-gray-900">No blog posts yet</h3>
									<p class="mt-2 text-gray-500">Get started by creating your first blog post.</p>
									<Button class="mt-4" onclick={startNewBlogPost}>
										<Plus class="h-4 w-4 mr-2" />
										Create Your First Post
									</Button>
								</div>
							{:else}
								<div class="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
									{#each blogPosts as post}
										<Card.Root class="hover:shadow-md transition-shadow">
											<Card.Header class="pb-3">
												<div class="flex items-start justify-between gap-2">
													<div class="flex-1 min-w-0">
														<Card.Title class="text-lg truncate">{post.title}</Card.Title>
														<div class="flex items-center gap-2 mt-1">
															<Badge class="{blogCategories[post.category].color} text-xs">
																{blogCategories[post.category].label}
															</Badge>
															<Badge variant={post.status === 'published' ? 'default' : post.status === 'draft' ? 'secondary' : 'destructive'} class="text-xs">
																{post.status}
															</Badge>
														</div>
													</div>
													<div class="flex gap-1">
														<Button size="sm" variant="ghost" onclick={() => editBlogPost(post)}>
															<Edit class="h-4 w-4" />
														</Button>
														<Button size="sm" variant="ghost" onclick={() => deleteBlogPostConfirm(post)} class="text-red-600 hover:text-red-700">
															<Trash2 class="h-4 w-4" />
														</Button>
													</div>
												</div>
											</Card.Header>
											<Card.Content>
												<p class="text-sm text-gray-600 line-clamp-3 mb-4">
													{post.excerpt || truncateHtml(post.content, 120)}
												</p>
												<div class="flex items-center justify-between text-xs text-gray-500">
													<div class="flex items-center gap-3">
														<span class="flex items-center gap-1">
															<Calendar class="h-3 w-3" />
															{formatDate(post.created_at || '')}
														</span>
														<span class="flex items-center gap-1">
															<Clock class="h-3 w-3" />
															{post.reading_time}m read
														</span>
													</div>
													{#if post.views}
														<span class="flex items-center gap-1">
															<Eye class="h-3 w-3" />
															{post.views} views
														</span>
													{/if}
												</div>
												{#if post.tags && post.tags.length > 0}
													<div class="flex flex-wrap gap-1 mt-3">
														{#each post.tags.slice(0, 3) as tag}
															<span class="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
																<Tag class="h-3 w-3" />
																{tag}
															</span>
														{/each}
														{#if post.tags.length > 3}
															<span class="text-xs text-gray-500">+{post.tags.length - 3} more</span>
														{/if}
													</div>
												{/if}
											</Card.Content>
										</Card.Root>
									{/each}
								</div>
							{/if}
						</Card.Content>
					</Card.Root>
				{/if}
			</Tabs.Content>

			<!-- Stats Section -->
			<Tabs.Content value="stats" class="space-y-6">
				<Card.Root class="border-0 shadow-lg">
					<Card.Header class="border-b bg-gradient-to-r from-emerald-50 to-teal-50">
						<Card.Title class="flex items-center gap-2 text-xl">
							<BarChart3 class="h-5 w-5 text-emerald-600" />
							Statistics
						</Card.Title>
						<Card.Description>
							Key numbers that showcase your experience and achievements
						</Card.Description>
					</Card.Header>
					<Card.Content class="pt-6">
						<div class="grid gap-6 lg:grid-cols-3">
							<div>
								<Label for="years-experience" class="text-sm font-medium text-gray-700">Years of Experience</Label>
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
								<Label for="projects-completed" class="text-sm font-medium text-gray-700">Projects Completed</Label>
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
								<Label for="satisfied-clients" class="text-sm font-medium text-gray-700">Satisfied Clients</Label>
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
					<Card.Header class="border-b bg-gradient-to-r from-purple-50 to-pink-50">
						<Card.Title class="flex items-center gap-2 text-xl">
							<FileText class="h-5 w-5 text-purple-600" />
							About Section
						</Card.Title>
						<Card.Description>
							Tell your story and highlight your expertise
						</Card.Description>
					</Card.Header>
					<Card.Content class="pt-6">
						<div class="space-y-6">
							<div>
								<Label for="about-description" class="text-sm font-medium text-gray-700">Description</Label>
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
										<Button size="sm" variant="outline" onclick={() => addToList('about', 'technicalExpertise')}>
											<Plus class="h-4 w-4" />
											Add
										</Button>
									</div>
									<div class="space-y-3">
										{#each currentContent.about.technicalExpertise as expertise, index}
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
													class="text-red-600 hover:text-red-700 hover:bg-red-50"
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
										<Button size="sm" variant="outline" onclick={() => addToList('about', 'industryFocus')}>
											<Plus class="h-4 w-4" />
											Add
										</Button>
									</div>
									<div class="space-y-3">
										{#each currentContent.about.industryFocus as focus, index}
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
													class="text-red-600 hover:text-red-700 hover:bg-red-50"
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
					<Card.Header class="border-b bg-gradient-to-r from-orange-50 to-red-50">
						<Card.Title class="flex items-center gap-2 text-xl">
							<Briefcase class="h-5 w-5 text-orange-600" />
							Services
						</Card.Title>
						<Card.Description>
							The services you offer to clients
						</Card.Description>
					</Card.Header>
					<Card.Content class="pt-6">
						<div class="mb-6">
							<Button onclick={addService} class="bg-orange-600 hover:bg-orange-700">
								<Plus class="h-4 w-4" />
								Add Service
							</Button>
						</div>

						<div class="space-y-6">
							{#each currentContent.services as service, index}
								<Card.Root class="border border-gray-200">
									<Card.Header class="pb-3">
										<div class="flex items-center justify-between">
											<Card.Title class="text-lg">Service {index + 1}</Card.Title>
											<Button
												size="sm"
												variant="ghost"
												onclick={() => removeService(index)}
												class="text-red-600 hover:text-red-700 hover:bg-red-50"
											>
												<Trash2 class="h-4 w-4" />
												Remove
											</Button>
										</div>
									</Card.Header>
									<Card.Content>
										<div class="grid gap-4 lg:grid-cols-3">
											<div>
												<Label for="service-title-{index}" class="text-sm font-medium text-gray-700">Service Title</Label>
												<Input
													id="service-title-{index}"
													bind:value={service.title}
													oninput={handleChange}
													placeholder="e.g., Data Analysis"
													class="mt-1"
												/>
											</div>
											<div>
												<Label for="service-icon-{index}" class="text-sm font-medium text-gray-700">Icon (Lucide name)</Label>
												<Input
													id="service-icon-{index}"
													bind:value={service.icon}
													oninput={handleChange}
													placeholder="e.g., BarChart3"
													class="mt-1"
												/>
											</div>
											<div>
												<Label for="service-description-{index}" class="text-sm font-medium text-gray-700">Description</Label>
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
					<Card.Header class="border-b bg-gradient-to-r from-cyan-50 to-blue-50">
						<Card.Title class="flex items-center gap-2 text-xl">
							<FolderOpen class="h-5 w-5 text-cyan-600" />
							Projects
						</Card.Title>
						<Card.Description>
							Showcase your best work and achievements
						</Card.Description>
					</Card.Header>
					<Card.Content class="pt-6">
						<div class="mb-6">
							<Button onclick={addProject} class="bg-cyan-600 hover:bg-cyan-700">
								<Plus class="h-4 w-4" />
								Add Project
							</Button>
						</div>

						<div class="space-y-6">
							{#each currentContent.projects as project, index}
								<Card.Root class="border border-gray-200">
									<Card.Header class="pb-3">
										<div class="flex items-center justify-between">
											<Card.Title class="text-lg">Project {index + 1}</Card.Title>
											<Button
												size="sm"
												variant="ghost"
												onclick={() => removeProject(index)}
												class="text-red-600 hover:text-red-700 hover:bg-red-50"
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
													<Label for="project-title-{index}" class="text-sm font-medium text-gray-700">Project Title</Label>
													<Input
														id="project-title-{index}"
														bind:value={project.title}
														oninput={handleChange}
														placeholder="e.g., Sales Dashboard Analytics"
														class="mt-1"
													/>
												</div>
												<div>
													<Label for="project-impact-{index}" class="text-sm font-medium text-gray-700">Business Impact</Label>
													<Input
														id="project-impact-{index}"
														bind:value={project.impact}
														oninput={handleChange}
														placeholder="e.g., 15% increase in sales efficiency"
														class="mt-1"
													/>
												</div>
												<div>
													<Label for="project-link-{index}" class="text-sm font-medium text-gray-700">Project Link</Label>
													<Input
														id="project-link-{index}"
														bind:value={project.link}
														oninput={handleChange}
														placeholder="https://..."
														class="mt-1"
													/>
												</div>
												<div>
													<Label for="project-image-{index}" class="text-sm font-medium text-gray-700">Image URL</Label>
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
												<Label for="project-description-{index}" class="text-sm font-medium text-gray-700">Description</Label>
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
													{#each project.technologies as tech, techIndex}
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
																class="text-red-600 hover:text-red-700 hover:bg-red-50"
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
					<Card.Header class="border-b bg-gradient-to-r from-indigo-50 to-purple-50">
						<Card.Title class="flex items-center gap-2 text-xl">
							<Cpu class="h-5 w-5 text-indigo-600" />
							Skills & Proficiency
						</Card.Title>
						<Card.Description>
							Your technical skills and expertise levels
						</Card.Description>
					</Card.Header>
					<Card.Content class="pt-6">
						<div class="grid gap-6 lg:grid-cols-2">
							{#each Object.entries(currentContent.skills) as [category, skillList]}
								<Card.Root class="border border-gray-200">
									<Card.Header class="pb-3">
										<div class="flex items-center justify-between">
											<Card.Title class="text-lg capitalize">{category.replace(/([A-Z])/g, ' $1').trim()}</Card.Title>
											<Button size="sm" variant="outline" onclick={() => addSkill(category)}>
												<Plus class="h-4 w-4" />
												Add
											</Button>
										</div>
									</Card.Header>
									<Card.Content>
										<div class="space-y-4">
											{#each skillList as skill, index}
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
															class="text-red-600 hover:text-red-700 hover:bg-red-50"
														>
															<Trash2 class="h-4 w-4" />
														</Button>
													</div>
													<div class="flex items-center gap-3">
														<Label class="text-sm text-gray-600 min-w-[70px]">Level: {skill.level}%</Label>
														<input
															type="range"
															min="0"
															max="100"
															bind:value={skill.level}
															oninput={handleChange}
															class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
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
					<Card.Header class="border-b bg-gradient-to-r from-green-50 to-emerald-50">
						<Card.Title class="flex items-center gap-2 text-xl">
							<Award class="h-5 w-5 text-green-600" />
							Work Experience
						</Card.Title>
						<Card.Description>
							Your professional experience and achievements
						</Card.Description>
					</Card.Header>
					<Card.Content class="pt-6">
						<div class="mb-6">
							<Button onclick={addExperience} class="bg-green-600 hover:bg-green-700">
								<Plus class="h-4 w-4" />
								Add Experience
							</Button>
						</div>

						<div class="space-y-6">
							{#each currentContent.experience as exp, index}
								<Card.Root class="border border-gray-200">
									<Card.Header class="pb-3">
										<div class="flex items-center justify-between">
											<Card.Title class="text-lg">Experience {index + 1}</Card.Title>
											<Button
												size="sm"
												variant="ghost"
												onclick={() => removeExperience(index)}
												class="text-red-600 hover:text-red-700 hover:bg-red-50"
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
													<Label for="exp-company-{index}" class="text-sm font-medium text-gray-700">Company</Label>
													<Input
														id="exp-company-{index}"
														bind:value={exp.company}
														oninput={handleChange}
														placeholder="e.g., Tech Corp"
														class="mt-1"
													/>
												</div>
												<div>
													<Label for="exp-position-{index}" class="text-sm font-medium text-gray-700">Position</Label>
													<Input
														id="exp-position-{index}"
														bind:value={exp.position}
														oninput={handleChange}
														placeholder="e.g., Senior Data Analyst"
														class="mt-1"
													/>
												</div>
												<div>
													<Label for="exp-period-{index}" class="text-sm font-medium text-gray-700">Period</Label>
													<Input
														id="exp-period-{index}"
														bind:value={exp.period}
														oninput={handleChange}
														placeholder="e.g., 2020 - Present"
														class="mt-1"
													/>
												</div>
												<div>
													<Label for="exp-location-{index}" class="text-sm font-medium text-gray-700">Location</Label>
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
												<Label for="exp-description-{index}" class="text-sm font-medium text-gray-700">Description</Label>
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
													{#each exp.achievements as achievement, achIndex}
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
																class="text-red-600 hover:text-red-700 hover:bg-red-50"
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
					<Card.Header class="border-b bg-gradient-to-r from-pink-50 to-rose-50">
						<Card.Title class="flex items-center gap-2 text-xl">
							<Mail class="h-5 w-5 text-pink-600" />
							Contact Information
						</Card.Title>
						<Card.Description>
							How people can reach you and connect with you
						</Card.Description>
					</Card.Header>
					<Card.Content class="pt-6">
						<div class="grid gap-6 lg:grid-cols-2">
							<div>
								<Label for="contact-email" class="text-sm font-medium text-gray-700">Email Address</Label>
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
								<Label for="contact-phone" class="text-sm font-medium text-gray-700">Phone Number</Label>
								<Input
									id="contact-phone"
									bind:value={currentContent.contact.phone}
									oninput={handleChange}
									placeholder="+1 (555) 123-4567"
									class="mt-1"
								/>
							</div>
							<div>
								<Label for="contact-location" class="text-sm font-medium text-gray-700">Location</Label>
								<Input
									id="contact-location"
									bind:value={currentContent.contact.location}
									oninput={handleChange}
									placeholder="City, State/Country"
									class="mt-1"
								/>
							</div>
							<div>
								<Label for="contact-github" class="text-sm font-medium text-gray-700">GitHub Profile</Label>
								<Input
									id="contact-github"
									bind:value={currentContent.contact.github}
									oninput={handleChange}
									placeholder="https://github.com/username"
									class="mt-1"
								/>
							</div>
							<div class="lg:col-span-2">
								<Label for="contact-linkedin" class="text-sm font-medium text-gray-700">LinkedIn Profile</Label>
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
				<div class="mx-auto mb-6 h-16 w-16 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
				<h3 class="text-lg font-medium text-gray-900 mb-2">Loading Content...</h3>
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
