<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Upload, X, Image as ImageIcon, Camera } from 'lucide-svelte';
  
  export let value: string = '';
  export let placeholder: string = 'Upload an image';
  export let accept: string = 'image/*';
  export let maxSize: number = 5 * 1024 * 1024; // 5MB
  export let aspectRatio: string = '1:1'; // '1:1', '16:9', '4:3', 'auto'
  export let quality: number = 0.8;
  export let maxWidth: number = 800;
  export let maxHeight: number = 800;
  
  const dispatch = createEventDispatcher();
  
  let fileInput: HTMLInputElement;
  let dragOver = false;
  let uploading = false;
  let preview = value;
  
  $: preview = value;
  
  function handleFileSelect(files: FileList | null) {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }
    
    if (file.size > maxSize) {
      alert(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB.`);
      return;
    }
    
    processImage(file);
  }
  
  async function processImage(file: File) {
    uploading = true;
    
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate dimensions
        let { width, height } = calculateDimensions(img.width, img.height);
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and resize image
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Convert to blob with compression
        canvas.toBlob((blob) => {
          if (blob) {
            // Create object URL for preview
            const url = URL.createObjectURL(blob);
            preview = url;
            value = url;
            
            // In a real app, you would upload this blob to your storage service
            // and set the value to the uploaded URL
            dispatch('upload', { file: blob, url });
          }
          uploading = false;
        }, 'image/jpeg', quality);
      };
      
      img.onerror = () => {
        alert('Error loading image. Please try another file.');
        uploading = false;
      };
      
      img.src = URL.createObjectURL(file);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Error processing image. Please try again.');
      uploading = false;
    }
  }
  
  function calculateDimensions(originalWidth: number, originalHeight: number) {
    let width = originalWidth;
    let height = originalHeight;
    
    // Apply aspect ratio constraints
    if (aspectRatio !== 'auto') {
      const [ratioW, ratioH] = aspectRatio.split(':').map(Number);
      const targetRatio = ratioW / ratioH;
      const currentRatio = width / height;
      
      if (currentRatio > targetRatio) {
        // Image is wider than target ratio
        width = height * targetRatio;
      } else {
        // Image is taller than target ratio
        height = width / targetRatio;
      }
    }
    
    // Apply max dimensions
    if (width > maxWidth) {
      height = (height * maxWidth) / width;
      width = maxWidth;
    }
    
    if (height > maxHeight) {
      width = (width * maxHeight) / height;
      height = maxHeight;
    }
    
    return { width: Math.round(width), height: Math.round(height) };
  }
  
  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    dragOver = true;
  }
  
  function handleDragLeave(e: DragEvent) {
    e.preventDefault();
    dragOver = false;
  }
  
  function handleDrop(e: DragEvent) {
    e.preventDefault();
    dragOver = false;
    handleFileSelect(e.dataTransfer?.files || null);
  }
  
  function openFileDialog() {
    fileInput.click();
  }
  
  function removeImage() {
    preview = '';
    value = '';
    dispatch('remove');
  }
  
  function handleUrlInput(e: Event) {
    const input = e.target as HTMLInputElement;
    const url = input.value.trim();
    
    if (url) {
      // Validate URL
      try {
        new URL(url);
        preview = url;
        value = url;
        dispatch('change', { url });
      } catch {
        // Invalid URL, keep old value
      }
    } else {
      preview = '';
      value = '';
      dispatch('change', { url: '' });
    }
  }
</script>

<div class="space-y-4">
  <!-- File Input (hidden) -->
  <input
    bind:this={fileInput}
    type="file"
    {accept}
    onchange={(e) => handleFileSelect((e.target as HTMLInputElement).files)}
    class="hidden"
  />
  
  <!-- Preview Area -->
  {#if preview}
    <div class="relative group">
      <div class="relative overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-50">
        <img
          src={preview}
          alt="Preview"
          class="w-full h-48 object-cover"
          onerror={() => {
            preview = '';
            value = '';
          }}
        />
        <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
          <button
            type="button"
            onclick={removeImage}
            class="opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-all duration-200"
            title="Remove image"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  {:else}
    <!-- Upload Area -->
    <div
      class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors duration-200 {dragOver ? 'border-blue-400 bg-blue-50' : ''} {uploading ? 'opacity-50 pointer-events-none' : ''}"
      role="button"
      tabindex="0"
      ondragover={handleDragOver}
      ondragleave={handleDragLeave}
      ondrop={handleDrop}
    >
      {#if uploading}
        <div class="animate-spin mx-auto w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
        <p class="mt-2 text-sm text-gray-600">Processing image...</p>
      {:else}
        <ImageIcon class="mx-auto h-12 w-12 text-gray-400" />
        <div class="mt-4">
          <button
            type="button"
            onclick={openFileDialog}
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Upload size={16} class="mr-2" />
            Upload Image
          </button>
        </div>
        <p class="mt-2 text-xs text-gray-500">
          {placeholder} or drag and drop
        </p>
        <p class="text-xs text-gray-500">
          PNG, JPG, GIF up to {Math.round(maxSize / 1024 / 1024)}MB
        </p>
      {/if}
    </div>
  {/if}
  
  <!-- URL Input Alternative -->
  <div class="text-center text-sm text-gray-500">
    <span>or</span>
  </div>
  
  <div>
    <label for="image-url" class="block text-sm font-medium text-gray-700 mb-1">
      Image URL
    </label>
    <input
      id="image-url"
      type="url"
      value={preview ? value : ''}
      oninput={handleUrlInput}
      placeholder="https://example.com/image.jpg"
      class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
    />
  </div>
  
  <!-- Image Settings -->
  {#if aspectRatio !== 'auto'}
    <div class="text-xs text-gray-500 bg-gray-50 p-2 rounded">
      <strong>Auto-formatting:</strong> Images will be cropped to {aspectRatio} aspect ratio and resized to max {maxWidth}×{maxHeight}px
    </div>
  {/if}
</div>

<style>
  /* Unused CSS selectors removed to fix warnings */
</style> 