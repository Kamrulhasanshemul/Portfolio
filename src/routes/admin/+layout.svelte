<script lang="ts">
	import { auth } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { LogOut, User, Menu, RefreshCw } from '@lucide/svelte';
	import AdminSidebar from '$lib/components/admin/AdminSidebar.svelte';
	import { content } from '$lib/stores/content';
	import { ContentService } from '$lib/supabase';

	interface AuthState {
		isAuthenticated: boolean;
		initialized: boolean;
		user: { username: string } | null;
	}

	let { children } = $props();

	let authState: AuthState = $state({ isAuthenticated: false, initialized: false, user: null });
	let isSidebarOpen = $state(true);
	let isLoadingContent = $state(false);

	onMount(() => {
		if (browser) {
			auth.checkAuth();
			loadGlobalContent();
		}
	});

	// Global content loader
	async function loadGlobalContent() {
		if ($content && Object.keys($content).length > 0) return; // Already loaded

		isLoadingContent = true;
		try {
			const dbContent = await ContentService.getContent();
			if (dbContent) {
				console.log('Admin Layout: Loaded content from Supabase');
				content.set(dbContent);
			} else {
				console.log('Admin Layout: Using local/default content');
			}
		} catch (error) {
			console.error('Admin Layout: Error loading content:', error);
		} finally {
			isLoadingContent = false;
		}
	}

	auth.subscribe((state) => {
		authState = state;

		// Only redirect after initialization is complete
		if (browser && state.initialized) {
			const currentPath = $page.url.pathname;

			if (!state.isAuthenticated && currentPath !== '/admin/login') {
				goto('/admin/login');
			} else if (state.isAuthenticated && currentPath === '/admin/login') {
				goto('/admin/overview');
			}
		}
	});

	function handleLogout() {
		auth.logout();
		goto('/admin/login');
	}

	// Helper to get title from path
	function getPageTitle(path: string) {
		if (path.includes('overview')) return 'Overview';
		if (path.includes('blog')) return 'Blog Posts';
		if (path.includes('profile')) return 'Profile';
		if (path.includes('portfolio')) return 'Portfolio';
		return 'Admin Panel';
	}
</script>

{#if !authState.initialized}
	<!-- Enhanced Loading State -->
	<div
		class="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50"
	>
		<Card.Root class="w-full max-w-md border-0 shadow-xl">
			<Card.Content class="pt-6">
				<div class="text-center">
					<div
						class="mx-auto mb-6 h-16 w-16 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"
					></div>
					<h3 class="mb-2 text-lg font-medium text-gray-900">Initializing Admin Panel</h3>
					<p class="text-sm text-gray-500">Setting up your dashboard environment...</p>
				</div>
			</Card.Content>
		</Card.Root>
	</div>
{:else if authState.isAuthenticated && $page.url.pathname !== '/admin/login'}
	<!-- Modern Admin Layout -->
	<div class="flex h-screen bg-gray-50">
		<AdminSidebar isOpen={isSidebarOpen} onToggle={() => (isSidebarOpen = !isSidebarOpen)} />

		<!-- Main Content Area -->
		<main
			class="flex-1 overflow-y-auto {isSidebarOpen
				? 'md:ml-64'
				: 'md:ml-20'} transition-all duration-300"
		>
			<!-- Header -->
			<header
				class="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm"
			>
				<div class="flex items-center gap-4">
					{#if !isSidebarOpen}
						<Button
							variant="ghost"
							size="icon"
							onclick={() => (isSidebarOpen = true)}
							class="md:hidden"
						>
							<Menu class="h-5 w-5" />
						</Button>
					{/if}
					<h1 class="text-xl font-semibold text-gray-800">{getPageTitle($page.url.pathname)}</h1>
				</div>

				<!-- Right Side - User Menu & Actions -->
				<div class="flex items-center gap-4">
					{#if authState.user}
						<div class="flex items-center gap-3">
							<div class="hidden items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 md:flex">
								<User class="h-4 w-4 text-gray-600" />
								<span class="text-sm font-medium text-gray-700">
									{authState.user.username}
								</span>
							</div>

							<Button variant="outline" size="sm" onclick={handleLogout} class="group">
								<LogOut class="h-4 w-4 transition-colors group-hover:text-red-600" />
								<span class="ml-2 hidden md:inline">Logout</span>
							</Button>
						</div>
					{/if}
				</div>
			</header>

			<div class="min-h-[calc(100vh-64px)] p-6">
				{#if isLoadingContent}
					<div class="flex h-64 items-center justify-center">
						<div class="text-center">
							<RefreshCw class="mx-auto mb-4 h-8 w-8 animate-spin text-blue-500" />
							<p class="text-gray-500">Loading content data...</p>
						</div>
					</div>
				{:else}
					{@render children()}
				{/if}
			</div>
		</main>
	</div>
{:else}
	<!-- Login Page Container -->
	<div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
		{@render children()}
	</div>
{/if}
