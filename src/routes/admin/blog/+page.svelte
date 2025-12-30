<script lang="ts">
	import BlogManager from '$lib/components/admin/BlogManager.svelte';
	import { content } from '$lib/stores/content';
</script>

{#if $content}
	<BlogManager content={$content} />
{:else}
	<div>Loading...</div>
{/if}
