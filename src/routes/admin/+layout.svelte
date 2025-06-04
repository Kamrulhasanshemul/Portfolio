<script>
    import { auth } from '$lib/stores/auth';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { Button } from '$lib/components/ui/button';
    import { browser } from '$app/environment';
    import { page } from '$app/stores';

    let authState = { isAuthenticated: false, initialized: false };

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
</script>

{#if !authState.initialized}
    <!-- Loading state -->
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
        <div class="text-center">
            <p class="text-lg text-gray-500">Loading...</p>
        </div>
    </div>
{:else if authState.isAuthenticated && $page.url.pathname !== '/admin/login'}
    <div class="min-h-screen bg-gray-50">
        <nav class="bg-white shadow-sm">
            <div class="container mx-auto px-4 py-3">
                <div class="flex justify-between items-center">
                    <div class="flex items-center space-x-4">
                        <h1 class="text-xl font-semibold">Admin Panel</h1>
                        {#if authState.user}
                            <span class="text-sm text-gray-500">Welcome, {authState.user.username}</span>
                        {/if}
                    </div>
                    <Button variant="outline" on:click={handleLogout}>Logout</Button>
                </div>
            </div>
        </nav>
        
        <slot />
    </div>
{:else}
    <slot />
{/if} 