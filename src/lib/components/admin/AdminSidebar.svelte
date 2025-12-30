<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import { LayoutDashboard, UserCircle, Briefcase, PenTool, Globe, Menu } from '@lucide/svelte';

	let { isOpen = true, onToggle } = $props<{
		isOpen?: boolean;
		onToggle?: () => void;
	}>();

	const sidebarItems = [
		{ href: '/admin/overview', label: 'Overview', icon: LayoutDashboard },
		{ href: '/admin/blog', label: 'Blog Posts', icon: PenTool },
		{ href: '/admin/portfolio', label: 'Portfolio', icon: Briefcase },
		{ href: '/admin/profile', label: 'Profile', icon: UserCircle }
	];

	function isActive(path: string) {
		return $page.url.pathname.startsWith(path);
	}
</script>

<aside
	class="{isOpen
		? 'w-64'
		: 'w-20'} fixed z-10 hidden h-full flex-col border-r bg-white transition-all duration-300 md:flex"
>
	<div class="flex h-16 items-center justify-between border-b px-4">
		{#if isOpen}
			<span
				class="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-xl font-bold text-transparent"
				>Admin</span
			>
		{/if}
		<Button variant="ghost" size="icon" onclick={onToggle} class="ml-auto">
			<Menu class="h-5 w-5 text-gray-500" />
		</Button>
	</div>

	<nav class="flex-1 space-y-2 p-4">
		{#each sidebarItems as item}
			<a
				href={item.href}
				class="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors
                {isActive(item.href)
					? 'bg-blue-50 text-blue-700'
					: 'text-gray-700 hover:bg-gray-100'}"
			>
				<item.icon class="h-5 w-5 {isOpen ? 'mr-3' : 'mx-auto'}" />
				{#if isOpen}
					{item.label}
				{/if}
			</a>
		{/each}
	</nav>

	<div class="border-t p-4">
		<Button
			variant="outline"
			class="w-full justify-start {isOpen ? '' : 'px-2'}"
			href="/"
			target="_blank"
		>
			<Globe class="h-4 w-4 {isOpen ? 'mr-2' : 'mx-auto'}" />
			{#if isOpen}View Site{/if}
		</Button>
	</div>
</aside>
