<script lang="ts">
	import { auth } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Card from '$lib/components/ui/card';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { 
		Shield, 
		Lock, 
		User as UserIcon, 
		AlertCircle,
		Eye,
		EyeOff
	} from 'lucide-svelte';

	let username = '';
	let password = '';
	let error = '';
	let isLoading = false;
	let showPassword = false;

	onMount(() => {
		if (browser) {
			auth.checkAuth();
			// If already authenticated, redirect to admin panel
			const unsubscribe = auth.subscribe(({ isAuthenticated }) => {
				if (isAuthenticated) {
					goto('/admin');
				}
			});

			return () => unsubscribe();
		}
	});

	async function handleLogin(event: Event) {
		event.preventDefault();

		if (!username || !password) {
			error = 'Please enter both username and password';
			return;
		}

		isLoading = true;
		error = '';

		try {
			const success = await auth.login(username, password);
			if (success) {
				goto('/admin');
			} else {
				error = 'Invalid credentials. Please check your username and password.';
			}
		} catch (err) {
			error = 'Login failed. Please try again.';
			console.error('Login error:', err);
		} finally {
			isLoading = false;
		}
	}

	function togglePasswordVisibility() {
		showPassword = !showPassword;
	}
</script>

<div class="min-h-screen flex items-center justify-center p-6">
	<Card.Root class="w-full max-w-md border-0 shadow-2xl">
		<!-- Header Section -->
		<Card.Header class="text-center pb-6">
			<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg">
				<Shield class="h-8 w-8" />
			</div>
			<Card.Title class="text-2xl font-bold text-gray-900">Admin Login</Card.Title>
			<Card.Description class="text-gray-600">
				Sign in to manage your portfolio content
			</Card.Description>
		</Card.Header>

		<!-- Form Section -->
		<Card.Content>
			<form onsubmit={handleLogin} class="space-y-5">
				<!-- Username Field -->
				<div class="space-y-2">
					<Label for="username" class="text-sm font-medium text-gray-700">Username</Label>
					<div class="relative">
						<UserIcon class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
						<Input
							id="username"
							name="username"
							type="text"
							autocomplete="username"
							required
							bind:value={username}
							disabled={isLoading}
							placeholder="Enter your username"
							class="pl-10 h-11"
						/>
					</div>
				</div>

				<!-- Password Field -->
				<div class="space-y-2">
					<Label for="password" class="text-sm font-medium text-gray-700">Password</Label>
					<div class="relative">
						<Lock class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
						<Input
							id="password"
							name="password"
							type={showPassword ? 'text' : 'password'}
							autocomplete="current-password"
							required
							bind:value={password}
							disabled={isLoading}
							placeholder="Enter your password"
							class="pl-10 pr-10 h-11"
						/>
						<button
							type="button"
							onclick={togglePasswordVisibility}
							class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
							disabled={isLoading}
						>
							{#if showPassword}
								<EyeOff class="h-4 w-4" />
							{:else}
								<Eye class="h-4 w-4" />
							{/if}
						</button>
					</div>
				</div>

				<!-- Error Message -->
				{#if error}
					<div class="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
						<AlertCircle class="h-4 w-4 flex-shrink-0" />
						<span>{error}</span>
					</div>
				{/if}

				<!-- Submit Button -->
				<Button
					type="submit"
					class="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg transition-all duration-200"
					disabled={isLoading}
				>
					{#if isLoading}
						<div class="flex items-center gap-2">
							<div class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
							<span>Signing in...</span>
						</div>
					{:else}
						<span>Sign In</span>
					{/if}
				</Button>
			</form>
		</Card.Content>

		<!-- Footer Section -->
		<Card.Footer class="pt-6">
			<div class="w-full text-center">
				<div class="rounded-lg bg-gray-50 border border-gray-200 p-4">
					<p class="text-sm font-medium text-gray-700 mb-2">Default Credentials</p>
					<div class="space-y-1 text-xs text-gray-600">
						<p><span class="font-medium">Username:</span> admin</p>
						<p><span class="font-medium">Password:</span> admin123</p>
					</div>
				</div>
				<p class="mt-4 text-xs text-gray-500">
					Secure access to your portfolio management system
				</p>
			</div>
		</Card.Footer>
	</Card.Root>
</div>
