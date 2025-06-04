<script>
    import { auth } from '$lib/stores/auth';
    import { goto } from '$app/navigation';
    import { Button } from '$lib/components/ui/button';
    import { onMount } from 'svelte';

    let username = '';
    let password = '';
    let error = '';

    onMount(() => {
        auth.checkAuth();
        // If already authenticated, redirect to admin panel
        const unsubscribe = auth.subscribe(({ isAuthenticated }) => {
            if (isAuthenticated) {
                goto('/admin');
            }
        });

        return () => unsubscribe();
    });

    async function handleLogin() {
        error = '';
        if (!username || !password) {
            error = 'Please fill in all fields';
            return;
        }

        const success = auth.login(username, password);
        if (!success) {
            error = 'Invalid credentials';
        }
    }
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
            <h2 class="text-3xl font-bold text-center text-gray-900">Admin Login</h2>
        </div>
        <form class="mt-8 space-y-6" on:submit|preventDefault={handleLogin}>
            {#if error}
                <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
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
                    />
                </div>
                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        id="password"
                        type="password"
                        bind:value={password}
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>
            <Button type="submit" variant="default" class="w-full">Login</Button>
        </form>
    </div>
</div> 