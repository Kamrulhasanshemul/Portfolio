<script lang="ts">
	import { auth } from '$lib/stores/auth';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let username = '';
	let password = '';
	let error = '';
	let isLoading = false;

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
				error = 'Invalid credentials';
			}
		} catch (err) {
			error = 'Login failed. Please try again.';
			console.error('Login error:', err);
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-50">
	<div class="w-full max-w-md space-y-8">
		<div>
			<h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Admin Login</h2>
			<p class="mt-2 text-center text-sm text-gray-600">Sign in to manage your portfolio content</p>
		</div>
		<form class="mt-8 space-y-6" on:submit={handleLogin}>
			<div class="-space-y-px rounded-md shadow-sm">
				<div>
					<label for="username" class="sr-only">Username</label>
					<input
						id="username"
						name="username"
						type="text"
						autocomplete="username"
						required
						class="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
						placeholder="Username"
						bind:value={username}
						disabled={isLoading}
					/>
				</div>
				<div>
					<label for="password" class="sr-only">Password</label>
					<input
						id="password"
						name="password"
						type="password"
						autocomplete="current-password"
						required
						class="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
						placeholder="Password"
						bind:value={password}
						disabled={isLoading}
					/>
				</div>
			</div>

			{#if error}
				<div class="text-center text-sm text-red-600">
					{error}
				</div>
			{/if}

			<div>
				<Button
					type="submit"
					class="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
					disabled={isLoading}
				>
					{#if isLoading}
						<span class="absolute inset-y-0 left-0 flex items-center pl-3">
							<div
								class="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"
							></div>
						</span>
						Signing in...
					{:else}
						Sign in
					{/if}
				</Button>
			</div>

			<div class="text-center text-sm text-gray-500">
				<p>Default credentials: admin / admin123</p>
			</div>
		</form>
	</div>
</div>
