<svelte:options runes={true} />

<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Image, Upload, X, Loader2 } from '@lucide/svelte';

	let {
		value = $bindable(''),
		path = 'uploads',
		label = 'Image',
		onChange
	} = $props<{
		value: string;
		path?: string;
		label?: string;
		onChange?: () => void;
	}>();

	let fileInput: HTMLInputElement;
	let uploading = $state(false);
	let error = $state('');
	let dragging = $state(false);

	async function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			await uploadFile(file);
		}
	}

	async function uploadFile(file: File) {
		// Basic validation
		if (!file.type.startsWith('image/')) {
			error = 'Please upload an image file';
			return;
		}
		if (file.size > 5 * 1024 * 1024) {
			// 5MB limit
			error = 'Image size should be less than 5MB';
			return;
		}

		uploading = true;
		error = '';

		try {
			const formData = new FormData();
			formData.append('file', file);
			formData.append('path', path);

			// If replacing, send old URL to delete
			if (value && value.startsWith('http')) {
				formData.append('oldUrl', value);
			}

			const response = await fetch('/api/upload', {
				method: 'POST',
				body: formData
			});

			const result = await response.json();

			if (result.success) {
				value = result.url; // Update bindable value
				onChange?.();
			} else {
				error = result.error || 'Upload failed';
			}
		} catch (err) {
			console.error('Upload error:', err);
			error = 'Failed to upload image';
		} finally {
			uploading = false;
			// Reset input so same file can be selected again if needed
			if (fileInput) fileInput.value = '';
		}
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		dragging = true;
	}

	function handleDragLeave(e: DragEvent) {
		e.preventDefault();
		dragging = false;
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		dragging = false;
		const file = e.dataTransfer?.files[0];
		if (file) {
			uploadFile(file);
		}
	}

	async function removeImage() {
		if (!value) return;

		// If it's a remote URL (Supabase storage), try to delete it
		if (value.startsWith('http')) {
			try {
				await fetch('/api/upload', {
					method: 'DELETE',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ url: value })
				});
			} catch (err) {
				console.error('Failed to delete image:', err);
				// Continue to remove from UI even if delete fails
			}
		}

		value = '';
		dispatch('remove');
		dispatch('change', { url: '' });
		onChange?.();
	}
</script>

<div class="space-y-2">
	<Label>{label}</Label>

	{#if value}
		<!-- Preview State -->
		<div class="group relative overflow-hidden rounded-lg border border-gray-200">
			<div class="flex aspect-video w-full items-center justify-center bg-gray-50">
				<img
					src={value}
					alt="Preview"
					class="h-full w-full object-cover"
					onerror={(e) => {
						// Fallback for broken images
						(e.target as HTMLImageElement).src =
							'https://via.placeholder.com/400x300?text=Invalid+Image';
					}}
				/>
			</div>

			<div
				class="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
			>
				<Button variant="secondary" size="sm" onclick={() => fileInput.click()}>Replace</Button>
				<Button
					variant="destructive"
					size="icon"
					class="h-8 w-8"
					onclick={(e) => {
						e.preventDefault();
						removeImage();
					}}
				>
					<X class="h-4 w-4" />
				</Button>
			</div>
		</div>
		<div class="truncate text-xs break-all text-gray-400">
			{value}
		</div>
	{:else}
		<!-- Upload State -->
		<div
			class="relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 p-6 transition-colors hover:bg-gray-100 {dragging
				? 'border-blue-500 bg-blue-50'
				: ''}"
			role="button"
			tabindex="0"
			onkeydown={(e) => e.key === 'Enter' && fileInput.click()}
			onclick={() => !uploading && fileInput.click()}
			ondragover={handleDragOver}
			ondragleave={handleDragLeave}
			ondrop={handleDrop}
		>
			{#if uploading}
				<div class="text-primary flex flex-col items-center gap-2">
					<Loader2 class="h-8 w-8 animate-spin" />
					<span class="text-sm font-medium">Uploading...</span>
				</div>
			{:else}
				<div class="flex flex-col items-center gap-2 text-gray-500">
					<div class="rounded-full bg-white p-2 shadow-sm">
						<Upload class="h-6 w-6" />
					</div>
					<div class="text-center text-sm">
						<span class="text-primary font-medium">Click to upload</span> or drag and drop
					</div>
					<div class="text-xs">PNG, JPG, GIF up to 5MB</div>
				</div>
			{/if}
		</div>
	{/if}

	{#if error}
		<div class="text-xs text-red-500">{error}</div>
	{/if}

	<input
		bind:this={fileInput}
		type="file"
		accept="image/*"
		class="hidden"
		onchange={handleFileSelect}
	/>
</div>
