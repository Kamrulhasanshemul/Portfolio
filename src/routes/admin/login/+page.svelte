<script lang="ts">
	import { auth } from '$lib/stores/auth';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Card from '$lib/components/ui/card';
	import { onMount } from 'svelte';
	import { Shield, Lock, User as UserIcon, Mail, AlertCircle, Eye, EyeOff } from '@lucide/svelte';

	let username = $state('');
	let password = $state('');
	let email = $state('');
	let confirmPassword = $state('');
	let error = $state('');
	let isLoading = $state(false);
	let showPassword = $state(false);
	let needsSetup = $state(false);
	let checkingSetup = $state(true);

	onMount(async () => {
		// Detect first-time setup (no admin users exist yet)
		try {
			const response = await fetch('/api/admin', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ action: 'setup-status' })
			});
			if (response.ok) {
				const data = await response.json();
				needsSetup = !!data.needsSetup;
			}
		} catch {
			// If the check fails we just show the normal login form
		} finally {
			checkingSetup = false;
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

		const result = await auth.login(username, password);
		if (result.success) {
			// Full navigation so the server session cookie takes effect everywhere
			window.location.href = '/admin/overview';
		} else {
			error = result.error || 'Invalid credentials. Please check your username and password.';
			isLoading = false;
		}
	}

	async function handleSetup(event: Event) {
		event.preventDefault();

		if (!username || !email || !password) {
			error = 'Please fill in all fields';
			return;
		}
		if (password.length < 8) {
			error = 'Password must be at least 8 characters';
			return;
		}
		if (password !== confirmPassword) {
			error = 'Passwords do not match';
			return;
		}

		isLoading = true;
		error = '';

		try {
			const response = await fetch('/api/admin', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ action: 'initialize', username, email, password })
			});
			const data = await response.json();

			if (response.ok) {
				window.location.href = '/admin/overview';
			} else {
				error = data.error || 'Setup failed. Please try again.';
				isLoading = false;
			}
		} catch {
			error = 'Setup failed. Please try again.';
			isLoading = false;
		}
	}
</script>

<div class="flex min-h-screen items-center justify-center p-6">
	<Card.Root class="w-full max-w-md border-0 shadow-2xl">
		<!-- Header Section -->
		<Card.Header class="pb-6 text-center">
			<div
				class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg"
			>
				<Shield class="h-8 w-8" />
			</div>
			<Card.Title class="text-2xl font-bold text-gray-900">
				{needsSetup ? 'Welcome!' : 'Admin Login'}
			</Card.Title>
			<Card.Description class="text-gray-600">
				{needsSetup
					? 'Create your first admin account to get started'
					: 'Sign in to manage your portfolio content'}
			</Card.Description>
		</Card.Header>

		<!-- Form Section -->
		<Card.Content>
			{#if checkingSetup}
				<div class="flex items-center justify-center py-8">
					<div
						class="h-8 w-8 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600"
					></div>
				</div>
			{:else}
				<form onsubmit={needsSetup ? handleSetup : handleLogin} class="space-y-5">
					<!-- Username Field -->
					<div class="space-y-2">
						<Label for="username" class="text-sm font-medium text-gray-700">Username</Label>
						<div class="relative">
							<UserIcon class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
							<Input
								id="username"
								name="username"
								type="text"
								autocomplete="username"
								required
								bind:value={username}
								disabled={isLoading}
								placeholder="Enter your username"
								class="h-11 pl-10"
							/>
						</div>
					</div>

					{#if needsSetup}
						<!-- Email Field (setup only) -->
						<div class="space-y-2">
							<Label for="email" class="text-sm font-medium text-gray-700">Email</Label>
							<div class="relative">
								<Mail class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
								<Input
									id="email"
									name="email"
									type="email"
									autocomplete="email"
									required
									bind:value={email}
									disabled={isLoading}
									placeholder="you@example.com"
									class="h-11 pl-10"
								/>
							</div>
						</div>
					{/if}

					<!-- Password Field -->
					<div class="space-y-2">
						<Label for="password" class="text-sm font-medium text-gray-700">Password</Label>
						<div class="relative">
							<Lock class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
							<Input
								id="password"
								name="password"
								type={showPassword ? 'text' : 'password'}
								autocomplete={needsSetup ? 'new-password' : 'current-password'}
								required
								bind:value={password}
								disabled={isLoading}
								placeholder={needsSetup ? 'At least 8 characters' : 'Enter your password'}
								class="h-11 pr-10 pl-10"
							/>
							<button
								type="button"
								onclick={() => (showPassword = !showPassword)}
								class="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
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

					{#if needsSetup}
						<!-- Confirm Password (setup only) -->
						<div class="space-y-2">
							<Label for="confirm-password" class="text-sm font-medium text-gray-700">
								Confirm Password
							</Label>
							<div class="relative">
								<Lock class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
								<Input
									id="confirm-password"
									name="confirm-password"
									type={showPassword ? 'text' : 'password'}
									autocomplete="new-password"
									required
									bind:value={confirmPassword}
									disabled={isLoading}
									placeholder="Repeat your password"
									class="h-11 pl-10"
								/>
							</div>
						</div>
					{/if}

					<!-- Error Message -->
					{#if error}
						<div
							class="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
						>
							<AlertCircle class="h-4 w-4 flex-shrink-0" />
							<span>{error}</span>
						</div>
					{/if}

					<!-- Submit Button -->
					<Button
						type="submit"
						class="h-11 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-indigo-700"
						disabled={isLoading}
					>
						{#if isLoading}
							<div class="flex items-center gap-2">
								<div
									class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
								></div>
								<span>{needsSetup ? 'Creating account...' : 'Signing in...'}</span>
							</div>
						{:else}
							<span>{needsSetup ? 'Create Admin Account' : 'Sign In'}</span>
						{/if}
					</Button>
				</form>
			{/if}
		</Card.Content>

		<!-- Footer Section -->
		<Card.Footer class="pt-6">
			<div class="w-full text-center">
				<p class="text-xs text-gray-500">Secure access to your portfolio management system</p>
			</div>
		</Card.Footer>
	</Card.Root>
</div>
