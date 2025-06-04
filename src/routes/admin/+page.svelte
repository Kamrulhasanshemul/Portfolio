<script>
    import { content } from '$lib/stores/content';
    import { Button } from '$lib/components/ui/button';
    import { onMount } from 'svelte';

    let currentContent;
    let isDirty = false;
    let lastSaved = null;

    content.subscribe(value => {
        currentContent = JSON.parse(JSON.stringify(value)); // Deep copy to track changes
    });

    function updateContent() {
        content.set(currentContent);
        isDirty = false;
        lastSaved = new Date();
        alert('Content updated successfully!');
    }

    function handleChange() {
        isDirty = true;
    }

    function resetChanges() {
        content.subscribe(value => {
            currentContent = JSON.parse(JSON.stringify(value));
            isDirty = false;
        })();
    }

    // Add a new skill to a category
    function addSkill(category) {
        currentContent.skills[category] = [
            ...currentContent.skills[category],
            { name: '', level: 50 }
        ];
        handleChange();
    }

    // Remove a skill from a category
    function removeSkill(category, index) {
        currentContent.skills[category] = currentContent.skills[category].filter((_, i) => i !== index);
        handleChange();
    }
</script>

<div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
        <div>
            <h1 class="text-3xl font-bold">Content Management</h1>
            {#if lastSaved}
                <p class="text-sm text-gray-500">Last saved: {lastSaved.toLocaleString()}</p>
            {/if}
        </div>
        <div class="flex gap-4">
            {#if isDirty}
                <Button variant="outline" on:click={resetChanges}>Reset Changes</Button>
            {/if}
            <Button variant="default" on:click={updateContent} disabled={!isDirty}>Save Changes</Button>
        </div>
    </div>

    <div class="space-y-8">
        <!-- Hero Section -->
        <section class="bg-white p-6 rounded-lg shadow-md">
            <h2 class="text-2xl font-semibold mb-4">Hero Section</h2>
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-1">Title</label>
                    <input 
                        type="text" 
                        bind:value={currentContent.hero.title}
                        on:input={handleChange}
                        class="w-full p-2 border rounded"
                    >
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Subtitle</label>
                    <input 
                        type="text" 
                        bind:value={currentContent.hero.subtitle}
                        on:input={handleChange}
                        class="w-full p-2 border rounded"
                    >
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Description</label>
                    <textarea 
                        bind:value={currentContent.hero.description}
                        on:input={handleChange}
                        class="w-full p-2 border rounded h-24"
                    ></textarea>
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Profile Image URL</label>
                    <input 
                        type="text" 
                        bind:value={currentContent.hero.profileImage}
                        on:input={handleChange}
                        class="w-full p-2 border rounded"
                    >
                </div>
            </div>
        </section>

        <!-- Stats Section -->
        <section class="bg-white p-6 rounded-lg shadow-md">
            <h2 class="text-2xl font-semibold mb-4">Stats</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label class="block text-sm font-medium mb-1">Years Experience</label>
                    <input 
                        type="number" 
                        bind:value={currentContent.stats.yearsExperience}
                        on:input={handleChange}
                        class="w-full p-2 border rounded"
                    >
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Projects Completed</label>
                    <input 
                        type="number" 
                        bind:value={currentContent.stats.projectsCompleted}
                        on:input={handleChange}
                        class="w-full p-2 border rounded"
                    >
                </div>
                <div>
                    <label class="block text-sm font-medium mb-1">Satisfied Clients</label>
                    <input 
                        type="number" 
                        bind:value={currentContent.stats.satisfiedClients}
                        on:input={handleChange}
                        class="w-full p-2 border rounded"
                    >
                </div>
            </div>
        </section>

        <!-- Skills Section -->
        <section class="bg-white p-6 rounded-lg shadow-md">
            <h2 class="text-2xl font-semibold mb-4">Skills</h2>
            
            {#each Object.entries(currentContent.skills) as [category, skills]}
                <div class="mb-8">
                    <div class="flex justify-between items-center mb-3">
                        <h3 class="text-xl font-semibold capitalize">{category}</h3>
                        <Button variant="outline" size="sm" on:click={() => addSkill(category)}>
                            Add Skill
                        </Button>
                    </div>
                    <div class="space-y-3">
                        {#each skills as skill, index}
                            <div class="flex gap-4">
                                <input 
                                    type="text" 
                                    bind:value={skill.name}
                                    on:input={handleChange}
                                    class="flex-1 p-2 border rounded"
                                    placeholder="Skill name"
                                >
                                <input 
                                    type="number" 
                                    bind:value={skill.level}
                                    on:input={handleChange}
                                    class="w-24 p-2 border rounded"
                                    min="0"
                                    max="100"
                                    placeholder="Level"
                                >
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    class="text-red-600 hover:bg-red-50"
                                    on:click={() => removeSkill(category, index)}
                                >
                                    Remove
                                </Button>
                            </div>
                        {/each}
                    </div>
                </div>
            {/each}
        </section>
    </div>
</div> 