<script lang="ts">
	import ProfileManager from '$lib/components/admin/ProfileManager.svelte';
	import { content } from '$lib/stores/content';
	import { Button } from '$lib/components/ui/button';
	import { Save, RefreshCw, Eye } from '@lucide/svelte';

	let isDirty = $state(false);
	let isLoading = $state(false);
	let saveMessage = $state('');

	function handleChange() {
		isDirty = true;
	}

	async function saveContent() {
		if (!$content) return;
		isLoading = true;
		try {
			const ok = await content.update($content);
			if (ok) {
				isDirty = false;
				saveMessage = 'Saved!';
				setTimeout(() => (saveMessage = ''), 3000);
			} else {
				alert('Failed to save. Please try again.');
			}
		} catch {
			alert('Failed to save');
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="space-y-4">
	<div class="flex items-center justify-end gap-2">
		{#if saveMessage}
			<span class="text-sm text-green-600">{saveMessage}</span>
		{/if}
		<Button
			variant={isDirty ? 'default' : 'secondary'}
			onclick={saveContent}
			disabled={!isDirty || isLoading}
		>
			{#if isLoading}
				<RefreshCw class="mr-2 h-4 w-4 animate-spin" /> Saving...
			{:else if isDirty}
				<Save class="mr-2 h-4 w-4" /> Save Changes
			{:else}
				<Eye class="mr-2 h-4 w-4" /> Saved
			{/if}
		</Button>
	</div>

	{#if $content}
		<ProfileManager bind:content={$content} onChange={handleChange} />
	{/if}
</div>
