<script>
    import { auth } from '$lib/stores/auth';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { Button } from '$lib/components/ui/button';
    import { browser } from '$app/environment';

    let isAuthenticated = false;
    let currentPath = '';

    onMount(() => {
        auth.checkAuth();
        currentPath = window.location.pathname;
    });

    auth.subscribe(({ isAuthenticated: authState }) => {
        isAuthenticated = authState;
        if (browser && !isAuthenticated && currentPath !== '/admin/login') {
            goto('/admin/login');
        }
    });

    function handleLogout() {
        auth.logout();
        goto('/admin/login');
    }
</script>

{#if isAuthenticated && browser && currentPath !== '/admin/login'}
    <div class="min-h-screen bg-gray-50">
        <nav class="bg-white shadow-sm">
            <div class="container mx-auto px-4 py-3">
                <div class="flex justify-between items-center">
                    <h1 class="text-xl font-semibold">Admin Panel</h1>
                    <Button variant="outline" on:click={handleLogout}>Logout</Button>
                </div>
            </div>
        </nav>
        
        <slot />
    </div>
{:else}
    <slot />
{/if} 