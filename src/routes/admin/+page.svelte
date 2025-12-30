<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	onMount(() => {
		if (browser) {
			goto('/admin/overview');
		}
	});
</script>

<div class="flex h-full items-center justify-center">
	<p>Redirecting to overview...</p>
</div>
