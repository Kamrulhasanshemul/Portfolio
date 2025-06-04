<script>
    import { auth } from '$lib/stores/auth';
    import { goto } from '$app/navigation';
    import { Button } from '$lib/components/ui/button';
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';

    let username = '';
    let password = '';
    let error = '';

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

    async function handleLogin(event) {
        event.preventDefault();
        error = '';
        if (!username || !password) {
            error = 'Please fill in all fields';
            return;
        }

        const success = auth.login(username, password);
        if (!success) {
            error = 'Invalid credentials';
            password = ''; // Clear password on failed attempt
        }
    }
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
            <h2 class="text-3xl font-bold text-center text-gray-900">Admin Login</h2>
            <p class="mt-2 text-center text-sm text-gray-600">
                Sign in to access the admin panel
            </p>
        </div>
        <form class="mt-8 space-y-6" on:submit={handleLogin}>
            {#if error}
                <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    <span class="block sm:inline">{error}</span>
                </div>
            {/if}
            <div class="space-y-4">
                <div>
                    <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
                    <input
                        id="username"
                        type="text"
                        bind:value={username}
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        id="password"
                        type="password"
                        bind:value={password}
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
            </div>
            <Button type="submit" variant="default" class="w-full">
                Sign in
            </Button>
        </form>
    </div>
</div> 