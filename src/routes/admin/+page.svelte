<svelte:options runes={true} />

<script lang="ts">
	import { content } from '$lib/stores/content';
	import { Button } from '$lib/components/ui/button';
	import { onMount, onDestroy } from 'svelte';
	import type { Content } from '$lib/types/content';
	import { ContentService } from '$lib/supabase';
	import {
		LayoutDashboard,
		UserCircle,
		Briefcase,
		PenTool,
		Menu,
		Globe,
		Save,
		RefreshCw,
		Eye
	} from '@lucide/svelte';

	// Import sub-components
	import Overview from '$lib/components/admin/Overview.svelte';
	import BlogManager from '$lib/components/admin/BlogManager.svelte';
	import ProfileManager from '$lib/components/admin/ProfileManager.svelte';
	import PortfolioManager from '$lib/components/admin/PortfolioManager.svelte';

	// State using Runes
	let currentContent = $state<Content | null>(null);
	let originalContent = $state('');
	let isLoading = $state(true);
	let isDirty = $state(false);
	let saveMessage = $state('');
	let saveMessageType: 'success' | 'error' = $state('success');
	let saveTimeout: NodeJS.Timeout;

	// Layout state
	let activeSection = $state('overview');
	let isSidebarOpen = $state(true);

	const sidebarItems = [
		{ id: 'overview', label: 'Overview', icon: LayoutDashboard },
		{ id: 'content', label: 'Blog Posts', icon: PenTool },
		{ id: 'profile', label: 'Profile', icon: UserCircle },
		{ id: 'portfolio', label: 'Portfolio', icon: Briefcase }
	];

	onMount(async () => {
		await loadContent();
	});

	onDestroy(() => {
		if (saveTimeout) clearTimeout(saveTimeout);
	});

	function toggleSidebar() {
		isSidebarOpen = !isSidebarOpen;
	}

	async function loadContent() {
		isLoading = true;
		console.log('CONTENT STORE KEYS:', Object.keys(content));
		try {
			// First try to get from Supabase
			const dbContent = await ContentService.getContent();

			if (dbContent) {
				console.log('Loaded content from Supabase');
				content.set(dbContent);
				currentContent = JSON.parse(JSON.stringify(dbContent));
			} else {
				// Fallback to local store or default
				console.log('Using local/default content');
				const unsubscribe = content.subscribe((value) => {
					currentContent = JSON.parse(JSON.stringify(value));
				});
				unsubscribe();
			}

			if (currentContent) {
				originalContent = JSON.stringify(currentContent);
			}
		} catch (error) {
			console.error('Error loading content:', error);
			// Fallback
			const unsubscribe = content.subscribe((value) => {
				currentContent = JSON.parse(JSON.stringify(value));
			});
			unsubscribe();
		} finally {
			isLoading = false;
			checkDirty();
		}
	}

	function checkDirty() {
		if (!currentContent) return;
		const isChanged = JSON.stringify(currentContent) !== originalContent;
		isDirty = isChanged;
	}

	function handleChange() {
		checkDirty();
	}

	async function updateContent() {
		if (!currentContent) return;

		isLoading = true;
		saveMessage = '';

		try {
			// Save to Supabase
			const result = await ContentService.saveContent(currentContent);

			if (result.success) {
				// Update store
				content.set(currentContent);
				originalContent = JSON.stringify(currentContent);
				isDirty = false;

				saveMessage = 'Content saved successfully!';
				saveMessageType = 'success';
			} else {
				const errorMessage = (result.error as any)?.message || 'Failed to save to database';
				throw new Error(errorMessage);
			}
		} catch (error) {
			console.error('Error saving content:', error);
			saveMessage = 'Failed to save content. Please try again.';
			saveMessageType = 'error';
		} finally {
			isLoading = false;

			// Clear message after 3 seconds
			if (saveTimeout) clearTimeout(saveTimeout);
			saveTimeout = setTimeout(() => {
				saveMessage = '';
			}, 3000);
		}
	}
</script>

<div class="flex h-screen bg-gray-50">
	<!-- Sidebar -->
	<aside
		class="{isSidebarOpen
			? 'w-64'
			: 'w-20'} fixed z-10 hidden h-full flex-col border-r bg-white transition-all duration-300 md:flex"
	>
		<div class="flex h-16 items-center justify-between border-b px-4">
			{#if isSidebarOpen}
				<span
					class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-xl font-bold text-transparent"
					>Admin</span
				>
			{/if}
			<Button variant="ghost" size="icon" onclick={toggleSidebar} class="ml-auto">
				<Menu class="h-5 w-5 text-gray-500" />
			</Button>
		</div>

		<nav class="flex-1 space-y-2 p-4">
			{#each sidebarItems as item}
				<button
					onclick={() => (activeSection = item.id)}
					class="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors
                    {activeSection === item.id
						? 'bg-blue-50 text-blue-700'
						: 'text-gray-700 hover:bg-gray-100'}"
				>
					<item.icon class="h-5 w-5 {isSidebarOpen ? 'mr-3' : 'mx-auto'}" />
					{#if isSidebarOpen}
						{item.label}
					{/if}
				</button>
			{/each}
		</nav>

		<div class="border-t p-4">
			<Button variant="outline" class="w-full justify-start {isSidebarOpen ? '' : 'px-2'}" href="/">
				<Globe class="h-4 w-4 {isSidebarOpen ? 'mr-2' : 'mx-auto'}" />
				{#if isSidebarOpen}View Site{/if}
			</Button>
		</div>
	</aside>

	<!-- Main Content -->
	<main class="flex-1 overflow-y-auto md:ml-64">
		<!-- Header -->
		<header class="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-6">
			<h1 class="text-xl font-semibold text-gray-800 capitalize">{activeSection}</h1>

			<div class="flex items-center gap-4">
				<Button
					variant={isDirty ? 'default' : 'secondary'}
					size="sm"
					onclick={updateContent}
					disabled={!isDirty || isLoading}
					class="h-9 {isDirty ? 'bg-zinc-900 text-white hover:bg-zinc-800' : ''}"
				>
					{#if isLoading}
						<RefreshCw class="mr-2 h-4 w-4 animate-spin" />
						Saving...
					{:else if isDirty}
						<Save class="mr-2 h-4 w-4" />
						Save Changes
					{:else}
						<Eye class="mr-2 h-4 w-4" />
						Saved
					{/if}
				</Button>
			</div>
		</header>

		<div class="mx-auto max-w-7xl p-6">
			{#if saveMessage}
				<div
					class="mb-6 flex items-center gap-2 rounded-md px-3 py-2 text-sm {saveMessageType ===
					'success'
						? 'border border-zinc-200 bg-zinc-50 text-zinc-900'
						: 'border border-red-200 bg-red-50 text-red-900'}"
				>
					{saveMessage}
				</div>
			{/if}

			{#if isLoading && !currentContent}
				<div class="py-12 text-center">
					<div
						class="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"
					></div>
					<p class="mt-2 text-gray-600">Loading...</p>
				</div>
			{:else if currentContent}
				{#if activeSection === 'overview'}
					<Overview bind:content={currentContent} onChange={handleChange} />
				{:else if activeSection === 'content'}
					<BlogManager content={currentContent} />
				{:else if activeSection === 'profile'}
					<ProfileManager bind:content={currentContent} onChange={handleChange} />
				{:else if activeSection === 'portfolio'}
					<PortfolioManager bind:content={currentContent} onChange={handleChange} />
				{/if}
			{/if}
		</div>
	</main>
</div>
