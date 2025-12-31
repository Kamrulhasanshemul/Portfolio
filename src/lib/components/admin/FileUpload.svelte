<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Upload, X, FileText, Loader2 } from '@lucide/svelte';
	import { createEventDispatcher } from 'svelte';

	export let value: string = '';
	export let label: string = 'Upload File';
	export let accept: string = '.pdf,.doc,.docx';
	export let onChange: () => void = () => {};

	let uploading = false;
	let fileInput: HTMLInputElement;
	let error = '';

	const dispatch = createEventDispatcher();

	async function handleFileSelect(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;

		// Validation (Max 5MB)
		if (file.size > 5 * 1024 * 1024) {
			error = 'File size must be less than 5MB';
			return;
		}

		uploading = true;
		error = '';

		try {
			const formData = new FormData();
			formData.append('file', file);
			formData.append('type', 'resume'); // Special handling for resume

			const response = await fetch('/api/resume/upload', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				const result = await response.json();
				throw new Error(result.error || 'Upload failed');
			}

			const result = await response.json();
			value = result.url;
			onChange(); // Notify parent
			dispatch('upload', { url: value });
		} catch (err) {
			console.error('Upload Error:', err);
			error = (err as Error).message || 'Failed to upload file';
		} finally {
			uploading = false;
			if (fileInput) fileInput.value = '';
		}
	}

	function removeFile() {
		value = '';
		onChange();
	}
</script>

<div class="space-y-2">
	<div class="text-sm font-medium">{label}</div>

	{#if error}
		<div class="text-xs text-red-500">{error}</div>
	{/if}

	{#if value}
		<div class="flex items-center gap-3 rounded-md border bg-gray-50 p-3">
			<div class="rounded bg-blue-100 p-2 text-blue-600">
				<FileText class="h-5 w-5" />
			</div>
			<div class="min-w-0 flex-1">
				<div class="truncate text-sm font-medium">Resume Uploaded</div>
				<div class="truncate text-xs text-gray-500">{value.split('/').pop()}</div>
			</div>
			<Button
				variant="ghost"
				size="icon"
				onclick={removeFile}
				class="text-gray-500 hover:text-red-500"
			>
				<X class="h-4 w-4" />
			</Button>
		</div>
	{:else}
		<div class="flex items-center gap-2">
			<input
				type="file"
				bind:this={fileInput}
				{accept}
				on:change={handleFileSelect}
				class="hidden"
			/>
			<Button
				variant="outline"
				class="w-full justify-start"
				onclick={() => fileInput?.click()}
				disabled={uploading}
			>
				{#if uploading}
					<Loader2 class="mr-2 h-4 w-4 animate-spin" />
					Uploading...
				{:else}
					<Upload class="mr-2 h-4 w-4" />
					Select File
				{/if}
			</Button>
		</div>
		<div class="text-xs text-gray-500">Max 5MB. PDF, DOC, DOCX</div>
	{/if}
</div>
