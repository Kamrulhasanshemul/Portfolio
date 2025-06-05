<script lang="ts">
	import { auth } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import * as Card from '$lib/components/ui/card';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { 
		Shield, 
		LogOut, 
		User, 
		Home,
		Settings,
		Globe
	} from 'lucide-svelte';

	interface AuthState {
		isAuthenticated: boolean;
		initialized: boolean;
		user: { username: string } | null;
	}

	let authState: AuthState = { isAuthenticated: false, initialized: false, user: null };

	onMount(() => {
		if (browser) {
			auth.checkAuth();
		}
	});

	auth.subscribe((state) => {
		authState = state;

		// Only redirect after initialization is complete
		if (browser && state.initialized) {
			const currentPath = $page.url.pathname;

			if (!state.isAuthenticated && currentPath !== '/admin/login') {
				goto('/admin/login');
			} else if (state.isAuthenticated && currentPath === '/admin/login') {
				goto('/admin');
			}
		}
	});

	function handleLogout() {
		auth.logout();
		goto('/admin/login');
	}

	function goHome() {
		window.open('/', '_blank');
	}
</script>

{#if !authState.initialized}
	<!-- Enhanced Loading State -->
	<div class="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
		<Card.Root class="w-full max-w-md border-0 shadow-xl">
			<Card.Content class="pt-6">
				<div class="text-center">
					<div class="mx-auto mb-6 h-16 w-16 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
					<h3 class="text-lg font-medium text-gray-900 mb-2">Initializing Admin Panel</h3>
					<p class="text-sm text-gray-500">Setting up your dashboard environment...</p>
				</div>
			</Card.Content>
		</Card.Root>
	</div>
{:else if authState.isAuthenticated && $page.url.pathname !== '/admin/login'}
	<!-- Modern Admin Layout -->
	<div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
		<!-- Enhanced Navigation Header -->
		<nav class="sticky top-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85 shadow-sm">
			<div class="container mx-auto px-6 py-4">
				<div class="flex items-center justify-between">
					<!-- Left Side - Branding & Status -->
					<div class="flex items-center gap-6">
						<div class="flex items-center gap-3">
							<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
								<Shield class="h-5 w-5" />
							</div>
							<div>
								<h1 class="text-xl font-bold text-gray-900">Admin Panel</h1>
								<p class="text-xs text-gray-500">Portfolio Management</p>
							</div>
						</div>
						
						<Badge variant="secondary" class="hidden md:flex items-center gap-1 text-xs">
							<div class="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
							System Online
						</Badge>
					</div>

					<!-- Right Side - User Menu & Actions -->
					<div class="flex items-center gap-4">
						<Button variant="ghost" size="sm" onclick={goHome} class="hidden md:flex">
							<Globe class="h-4 w-4" />
							View Site
						</Button>
						
						{#if authState.user}
							<div class="flex items-center gap-3">
								<div class="hidden md:flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5">
									<User class="h-4 w-4 text-gray-600" />
									<span class="text-sm font-medium text-gray-700">
										{authState.user.username}
									</span>
								</div>
								
								<Button variant="outline" size="sm" onclick={handleLogout} class="group">
									<LogOut class="h-4 w-4 group-hover:text-red-600 transition-colors" />
									<span class="hidden md:inline ml-2">Logout</span>
								</Button>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</nav>

		<!-- Main Content Area -->
		<main class="min-h-[calc(100vh-80px)]">
			<slot />
		</main>

		<!-- Footer -->
		<footer class="border-t bg-white/50">
			<div class="container mx-auto px-6 py-4">
				<div class="flex items-center justify-between text-sm text-gray-500">
					<div class="flex items-center gap-2">
						<Settings class="h-4 w-4" />
						<span>Portfolio CMS v2.0</span>
					</div>
					<div>
						<span>Last accessed: {new Date().toLocaleDateString()}</span>
					</div>
				</div>
			</div>
		</footer>
	</div>
{:else}
	<!-- Login Page Container -->
	<div class="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
		<slot />
	</div>
{/if}
