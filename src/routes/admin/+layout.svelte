<script lang="ts">
	import { auth } from '$lib/stores/auth';
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { LogOut, User, Menu, RefreshCw } from '@lucide/svelte';
	import AdminSidebar from '$lib/components/admin/AdminSidebar.svelte';
	import { content } from '$lib/stores/content';

	let { data, children } = $props();

	// Server-verified session (from +layout.server.ts / hooks). The hooks
	// guard guarantees only authenticated users reach admin pages.
	const user = $derived(data.user);
	const isLoginPage = $derived($page.url.pathname === '/admin/login');

	let isSidebarOpen = $state(true);
	let isLoadingContent = $state(false);

	// Mirror the server session into the client store for components that use it
	$effect(() => {
		auth.setUser(user ?? null);
	});

	onMount(() => {
		if (browser && user) {
			loadGlobalContent();
		}
	});

	// Global content loader (via the API so it works identically everywhere)
	async function loadGlobalContent() {
		if ($content && Object.keys($content).length > 0 && $content.hero?.name !== 'John Doe') return;

		isLoadingContent = true;
		try {
			const response = await fetch('/api/content');
			if (response.ok) {
				const dbContent = await response.json();
				if (dbContent?.hero) {
					content.set(dbContent);
				}
			}
		} catch (error) {
			console.error('Admin Layout: Error loading content:', error);
		} finally {
			isLoadingContent = false;
		}
	}

	async function handleLogout() {
		await auth.logout();
		// Full navigation so the server sees the cleared cookie
		window.location.href = '/admin/login';
	}

	// Helper to get title from path
	function getPageTitle(path: string) {
		if (path.includes('overview')) return 'Overview';
		if (path.includes('blog')) return 'Blog Posts';
		if (path.includes('profile')) return 'Profile';
		if (path.includes('portfolio')) return 'Portfolio';
		if (path.includes('projects')) return 'Projects';
		if (path.includes('users')) return 'Users';
		return 'Admin Panel';
	}
</script>

{#if user && !isLoginPage}
	<!-- Admin Layout -->
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
					<div class="flex items-center gap-3">
						<div class="hidden items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 md:flex">
							<User class="h-4 w-4 text-gray-600" />
							<span class="text-sm font-medium text-gray-700">
								{user.username}
							</span>
						</div>

						<Button variant="outline" size="sm" onclick={handleLogout} class="group">
							<LogOut class="h-4 w-4 transition-colors group-hover:text-red-600" />
							<span class="ml-2 hidden md:inline">Logout</span>
						</Button>
					</div>
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
