<script lang="ts">
	import Overview from '$lib/components/admin/Overview.svelte';
	import { content } from '$lib/stores/content';
</script>

{#if $content}
	<Overview bind:content={$content} onChange={() => {}} />
{:else}
	<div>Loading...</div>
{/if}
