<script lang="ts">
	import { onMount } from 'svelte';
	import { content } from '$lib/stores/content';
	import '../app.css';

	let { children } = $props();

	onMount(() => {
		content.init();
	});
</script>

{@render children()}
