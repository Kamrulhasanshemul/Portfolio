<script lang="ts">
  import { Editor } from '@tiptap/core';
  import StarterKit from '@tiptap/starter-kit';
  import Link from '@tiptap/extension-link';
  import Image from '@tiptap/extension-image';
  import { onMount, onDestroy } from 'svelte';
  import { 
    Bold, 
    Italic, 
    Underline, 
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
    Image as ImageIcon,
    AlignLeft,
    AlignCenter,
    AlignRight
  } from 'lucide-svelte';

  export let content: string = '';
  export const placeholder: string = 'Start writing your blog post...';
  export let readonly: boolean = false;
  
  let element: HTMLElement;
  let editor: Editor;

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
          openOnClick: false,
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
  $: if (editor && content !== editor.getHTML()) {
    editor.commands.setContent(content, false);
  }

  function toggleBold() {
    editor.chain().focus().toggleBold().run();
  }

  function toggleItalic() {
    editor.chain().focus().toggleItalic().run();
  }

  function toggleStrike() {
    editor.chain().focus().toggleStrike().run();
  }

  function toggleCode() {
    editor.chain().focus().toggleCode().run();
  }

  function toggleBlockquote() {
    editor.chain().focus().toggleBlockquote().run();
  }

  function toggleBulletList() {
    editor.chain().focus().toggleBulletList().run();
  }

  function toggleOrderedList() {
    editor.chain().focus().toggleOrderedList().run();
  }

  function setHeading(level: 1 | 2 | 3) {
    editor.chain().focus().toggleHeading({ level }).run();
  }

  function undo() {
    editor.chain().focus().undo().run();
  }

  function redo() {
    editor.chain().focus().redo().run();
  }

  function addLink() {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }

  function addImage() {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }
</script>

<div class="border border-gray-300 rounded-lg overflow-hidden bg-white">
  {#if !readonly}
    <!-- Toolbar -->
    <div class="border-b border-gray-200 bg-gray-50 p-2 flex flex-wrap gap-1">
      <!-- Undo/Redo -->
      <div class="flex border-r border-gray-300 pr-2 mr-2">
        <button
          type="button"
          onclick={undo}
          class="p-1.5 rounded hover:bg-gray-200 transition-colors"
          title="Undo"
        >
          <Undo size={16} />
        </button>
        <button
          type="button"
          onclick={redo}
          class="p-1.5 rounded hover:bg-gray-200 transition-colors"
          title="Redo"
        >
          <Redo size={16} />
        </button>
      </div>

      <!-- Headings -->
      <div class="flex border-r border-gray-300 pr-2 mr-2">
        <button
          type="button"
          onclick={() => setHeading(1)}
          class="p-1.5 rounded hover:bg-gray-200 transition-colors {editor?.isActive('heading', { level: 1 }) ? 'bg-blue-100' : ''}"
          title="Heading 1"
        >
          <Heading1 size={16} />
        </button>
        <button
          type="button"
          onclick={() => setHeading(2)}
          class="p-1.5 rounded hover:bg-gray-200 transition-colors {editor?.isActive('heading', { level: 2 }) ? 'bg-blue-100' : ''}"
          title="Heading 2"
        >
          <Heading2 size={16} />
        </button>
        <button
          type="button"
          onclick={() => setHeading(3)}
          class="p-1.5 rounded hover:bg-gray-200 transition-colors {editor?.isActive('heading', { level: 3 }) ? 'bg-blue-100' : ''}"
          title="Heading 3"
        >
          <Heading3 size={16} />
        </button>
      </div>

      <!-- Text Formatting -->
      <div class="flex border-r border-gray-300 pr-2 mr-2">
        <button
          type="button"
          onclick={toggleBold}
          class="p-1.5 rounded hover:bg-gray-200 transition-colors {editor?.isActive('bold') ? 'bg-blue-100' : ''}"
          title="Bold"
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onclick={toggleItalic}
          class="p-1.5 rounded hover:bg-gray-200 transition-colors {editor?.isActive('italic') ? 'bg-blue-100' : ''}"
          title="Italic"
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          onclick={toggleStrike}
          class="p-1.5 rounded hover:bg-gray-200 transition-colors {editor?.isActive('strike') ? 'bg-blue-100' : ''}"
          title="Strikethrough"
        >
          <Strikethrough size={16} />
        </button>
        <button
          type="button"
          onclick={toggleCode}
          class="p-1.5 rounded hover:bg-gray-200 transition-colors {editor?.isActive('code') ? 'bg-blue-100' : ''}"
          title="Code"
        >
          <Code size={16} />
        </button>
      </div>

      <!-- Lists and Quotes -->
      <div class="flex border-r border-gray-300 pr-2 mr-2">
        <button
          type="button"
          onclick={toggleBulletList}
          class="p-1.5 rounded hover:bg-gray-200 transition-colors {editor?.isActive('bulletList') ? 'bg-blue-100' : ''}"
          title="Bullet List"
        >
          <List size={16} />
        </button>
        <button
          type="button"
          onclick={toggleOrderedList}
          class="p-1.5 rounded hover:bg-gray-200 transition-colors {editor?.isActive('orderedList') ? 'bg-blue-100' : ''}"
          title="Numbered List"
        >
          <ListOrdered size={16} />
        </button>
        <button
          type="button"
          onclick={toggleBlockquote}
          class="p-1.5 rounded hover:bg-gray-200 transition-colors {editor?.isActive('blockquote') ? 'bg-blue-100' : ''}"
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
          class="p-1.5 rounded hover:bg-gray-200 transition-colors {editor?.isActive('link') ? 'bg-blue-100' : ''}"
          title="Add Link"
        >
          <LinkIcon size={16} />
        </button>
        <button
          type="button"
          onclick={addImage}
          class="p-1.5 rounded hover:bg-gray-200 transition-colors"
          title="Add Image"
        >
          <ImageIcon size={16} />
        </button>
      </div>
    </div>
  {/if}

  <!-- Editor Content -->
  <div 
    bind:this={element}
    class="prose prose-sm max-w-none p-4 min-h-[200px] focus:outline-none {readonly ? 'bg-gray-50' : ''}"
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