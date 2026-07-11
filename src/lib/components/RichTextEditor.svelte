<script lang="ts">
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Link from '@tiptap/extension-link';
	import Image from '@tiptap/extension-image';
	import { onMount, onDestroy } from 'svelte';
	import {
		Bold,
		Italic,
		Strikethrough,
		Code,
		Quote,
		List,
		ListOrdered,
		Undo,
		Redo,
		Heading1,
		Heading2,
		Heading3,
		Link as LinkIcon,
		Image as ImageIcon
	} from '@lucide/svelte';

	import { Loader2 } from '@lucide/svelte';

	let {
		content = $bindable(''),
		placeholder = 'Start writing your blog post...',
		readonly = false
	} = $props<{
		content?: string;
		placeholder?: string;
		readonly?: boolean;
	}>();

	let element: HTMLElement;
	let editor: Editor | undefined = $state();
	let fileInput: HTMLInputElement;
	let uploading = $state(false);

	onMount(() => {
		editor = new Editor({
			element: element,
			extensions: [
				StarterKit.configure({
					heading: {
						levels: [1, 2, 3]
					}
				}),
				Link.configure({
					openOnClick: false
				}),
				Image
			],
			content: content,
			editable: !readonly,
			onTransaction: () => {
				// Force re-render for reactive updates
				editor = editor;
			},
			onUpdate: ({ editor }) => {
				content = editor.getHTML();
			}
		});
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});

	// Update content when prop changes
	$effect(() => {
		if (editor && content !== editor.getHTML()) {
			editor.commands.setContent(content, false);
		}
	});

	function toggleBold() {
		editor?.chain().focus().toggleBold().run();
	}

	function toggleItalic() {
		editor?.chain().focus().toggleItalic().run();
	}

	function toggleStrike() {
		editor?.chain().focus().toggleStrike().run();
	}

	function toggleCode() {
		editor?.chain().focus().toggleCode().run();
	}

	function toggleBlockquote() {
		editor?.chain().focus().toggleBlockquote().run();
	}

	function toggleBulletList() {
		editor?.chain().focus().toggleBulletList().run();
	}

	function toggleOrderedList() {
		editor?.chain().focus().toggleOrderedList().run();
	}

	function setHeading(level: 1 | 2 | 3) {
		editor?.chain().focus().toggleHeading({ level }).run();
	}

	function undo() {
		editor?.chain().focus().undo().run();
	}

	function redo() {
		editor?.chain().focus().redo().run();
	}

	function addLink() {
		const url = window.prompt('Enter URL:');
		if (url) {
			editor?.chain().focus().setLink({ href: url }).run();
		}
	}

	function addImage() {
		fileInput.click();
	}

	async function handleImageUpload(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;

		// Basic validation
		if (!file.type.startsWith('image/')) {
			alert('Please upload an image file');
			return;
		}
		if (file.size > 5 * 1024 * 1024) {
			alert('Image size should be less than 5MB');
			return;
		}

		uploading = true;

		try {
			const formData = new FormData();
			formData.append('file', file);
			formData.append('path', 'blog-images');

			const response = await fetch('/api/upload', {
				method: 'POST',
				body: formData
			});

			const result = await response.json();

			if (result.success) {
				editor?.chain().focus().setImage({ src: result.url }).run();
			} else {
				alert(result.error || 'Upload failed');
			}
		} catch (err) {
			console.error('Upload error:', err);
			alert('Failed to upload image');
		} finally {
			uploading = false;
			// Reset input
			if (fileInput) fileInput.value = '';
		}
	}
</script>

<div class="overflow-hidden rounded-lg border border-gray-300 bg-white">
	{#if !readonly}
		<!-- Toolbar -->
		<div class="flex flex-wrap gap-1 border-b border-gray-200 bg-gray-50 p-2">
			<!-- Undo/Redo -->
			<div class="mr-2 flex border-r border-gray-300 pr-2">
				<button
					type="button"
					onclick={undo}
					class="rounded p-1.5 transition-colors hover:bg-gray-200"
					title="Undo"
				>
					<Undo size={16} />
				</button>
				<button
					type="button"
					onclick={redo}
					class="rounded p-1.5 transition-colors hover:bg-gray-200"
					title="Redo"
				>
					<Redo size={16} />
				</button>
			</div>

			<!-- Headings -->
			<div class="mr-2 flex border-r border-gray-300 pr-2">
				<button
					type="button"
					onclick={() => setHeading(1)}
					class="rounded p-1.5 transition-colors hover:bg-gray-200 {editor?.isActive('heading', {
						level: 1
					})
						? 'bg-blue-100'
						: ''}"
					title="Heading 1"
				>
					<Heading1 size={16} />
				</button>
				<button
					type="button"
					onclick={() => setHeading(2)}
					class="rounded p-1.5 transition-colors hover:bg-gray-200 {editor?.isActive('heading', {
						level: 2
					})
						? 'bg-blue-100'
						: ''}"
					title="Heading 2"
				>
					<Heading2 size={16} />
				</button>
				<button
					type="button"
					onclick={() => setHeading(3)}
					class="rounded p-1.5 transition-colors hover:bg-gray-200 {editor?.isActive('heading', {
						level: 3
					})
						? 'bg-blue-100'
						: ''}"
					title="Heading 3"
				>
					<Heading3 size={16} />
				</button>
			</div>

			<!-- Text Formatting -->
			<div class="mr-2 flex border-r border-gray-300 pr-2">
				<button
					type="button"
					onclick={toggleBold}
					class="rounded p-1.5 transition-colors hover:bg-gray-200 {editor?.isActive('bold')
						? 'bg-blue-100'
						: ''}"
					title="Bold"
				>
					<Bold size={16} />
				</button>
				<button
					type="button"
					onclick={toggleItalic}
					class="rounded p-1.5 transition-colors hover:bg-gray-200 {editor?.isActive('italic')
						? 'bg-blue-100'
						: ''}"
					title="Italic"
				>
					<Italic size={16} />
				</button>
				<button
					type="button"
					onclick={toggleStrike}
					class="rounded p-1.5 transition-colors hover:bg-gray-200 {editor?.isActive('strike')
						? 'bg-blue-100'
						: ''}"
					title="Strikethrough"
				>
					<Strikethrough size={16} />
				</button>
				<button
					type="button"
					onclick={toggleCode}
					class="rounded p-1.5 transition-colors hover:bg-gray-200 {editor?.isActive('code')
						? 'bg-blue-100'
						: ''}"
					title="Code"
				>
					<Code size={16} />
				</button>
			</div>

			<!-- Lists and Quotes -->
			<div class="mr-2 flex border-r border-gray-300 pr-2">
				<button
					type="button"
					onclick={toggleBulletList}
					class="rounded p-1.5 transition-colors hover:bg-gray-200 {editor?.isActive('bulletList')
						? 'bg-blue-100'
						: ''}"
					title="Bullet List"
				>
					<List size={16} />
				</button>
				<button
					type="button"
					onclick={toggleOrderedList}
					class="rounded p-1.5 transition-colors hover:bg-gray-200 {editor?.isActive('orderedList')
						? 'bg-blue-100'
						: ''}"
					title="Numbered List"
				>
					<ListOrdered size={16} />
				</button>
				<button
					type="button"
					onclick={toggleBlockquote}
					class="rounded p-1.5 transition-colors hover:bg-gray-200 {editor?.isActive('blockquote')
						? 'bg-blue-100'
						: ''}"
					title="Quote"
				>
					<Quote size={16} />
				</button>
			</div>

			<!-- Media -->
			<div class="flex">
				<button
					type="button"
					onclick={addLink}
					class="rounded p-1.5 transition-colors hover:bg-gray-200 {editor?.isActive('link')
						? 'bg-blue-100'
						: ''}"
					title="Add Link"
				>
					<LinkIcon size={16} />
				</button>
				<button
					type="button"
					onclick={addImage}
					disabled={uploading}
					class="rounded p-1.5 transition-colors hover:bg-gray-200"
					title="Add Image"
				>
					{#if uploading}
						<Loader2 size={16} class="animate-spin" />
					{:else}
						<ImageIcon size={16} />
					{/if}
				</button>
			</div>
		</div>
	{/if}

	<input
		type="file"
		accept="image/*"
		class="hidden"
		bind:this={fileInput}
		onchange={handleImageUpload}
	/>

	<!-- Editor Content -->
	<div
		bind:this={element}
		aria-label={placeholder}
		class="prose prose-sm min-h-[200px] max-w-none p-4 focus:outline-none {readonly
			? 'bg-gray-50'
			: ''}"
	></div>
</div>

<style>
	:global(.ProseMirror) {
		outline: none;
	}

	:global(.ProseMirror h1) {
		font-size: 1.5rem;
		font-weight: 700;
		margin-bottom: 0.5rem;
	}

	:global(.ProseMirror h2) {
		font-size: 1.25rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
	}

	:global(.ProseMirror h3) {
		font-size: 1.125rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
	}

	:global(.ProseMirror p) {
		margin-bottom: 0.75rem;
	}

	:global(.ProseMirror ul, .ProseMirror ol) {
		margin-left: 1rem;
		margin-bottom: 0.75rem;
	}

	:global(.ProseMirror li) {
		margin-bottom: 0.25rem;
	}

	:global(.ProseMirror blockquote) {
		border-left: 4px solid #e5e7eb;
		padding-left: 1rem;
		font-style: italic;
		margin: 1rem 0;
	}

	:global(.ProseMirror code) {
		background-color: #f3f4f6;
		padding: 0.125rem 0.25rem;
		border-radius: 0.25rem;
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
	}

	:global(.ProseMirror img) {
		max-width: 100%;
		height: auto;
		border-radius: 0.5rem;
		margin: 1rem 0;
	}

	:global(.ProseMirror a) {
		color: #3b82f6;
		text-decoration: underline;
	}
</style>
