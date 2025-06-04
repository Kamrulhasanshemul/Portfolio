<script>
    import { content } from '$lib/stores/content';
    import { Button } from '$lib/components/ui/button';
    import { onMount, onDestroy } from 'svelte';

    let currentContent;
    let isDirty = false;
    let lastSaved = null;
    let isLoading = false;
    let saveMessage = '';
    let saveMessageType = 'success'; // success, error

    // Subscribe to content changes
    const unsubscribe = content.subscribe(value => {
        if (value && Object.keys(value).length > 0) {
            console.log('Admin received content update with sections:', Object.keys(value));
            
            // Ensure all required sections exist
            const requiredSections = ['hero', 'stats', 'about', 'services', 'projects', 'skills', 'experience', 'contact'];
            const hasAllSections = requiredSections.every(section => value[section]);
            
            if (!hasAllSections) {
                console.warn('Incomplete content received in admin, some sections missing');
                // Don't update if content is incomplete
                return;
            }
            
            currentContent = JSON.parse(JSON.stringify(value)); // Deep copy to track changes
            console.log('Admin content updated successfully');
        }
    });

    async function updateContent() {
        isLoading = true;
        saveMessage = '';
        console.log('Admin: Saving content...', currentContent);
        
        try {
            const success = await content.update(currentContent);
            if (success) {
                isDirty = false;
                lastSaved = new Date();
                saveMessage = 'Content updated successfully!';
                saveMessageType = 'success';
                console.log('Admin: Content saved successfully');
                
                // Clear success message after 3 seconds
                setTimeout(() => {
                    saveMessage = '';
                }, 3000);
            } else {
                saveMessage = 'Failed to update content. Please try again.';
                saveMessageType = 'error';
            }
        } catch (error) {
            console.error('Admin: Error updating content:', error);
            saveMessage = 'An error occurred while saving. Please try again.';
            saveMessageType = 'error';
        } finally {
            isLoading = false;
        }
    }

    async function refreshContent() {
        isLoading = true;
        try {
            const success = await content.refresh();
            if (success) {
                isDirty = false;
                saveMessage = 'Content refreshed from server!';
                saveMessageType = 'success';
                setTimeout(() => {
                    saveMessage = '';
                }, 3000);
            } else {
                saveMessage = 'Failed to refresh content.';
                saveMessageType = 'error';
            }
        } catch (error) {
            console.error('Admin: Error refreshing content:', error);
            saveMessage = 'An error occurred while refreshing.';
            saveMessageType = 'error';
        } finally {
            isLoading = false;
        }
    }

    function handleChange() {
        isDirty = true;
        console.log('Admin: Content changed, marking as dirty');
    }

    function resetChanges() {
        // Get fresh data from store
        const unsubscribeReset = content.subscribe(value => {
            if (value) {
                currentContent = JSON.parse(JSON.stringify(value));
                isDirty = false;
                saveMessage = 'Changes reset to last saved version.';
                saveMessageType = 'success';
                setTimeout(() => {
                    saveMessage = '';
                }, 3000);
            }
        });
        unsubscribeReset();
    }

    // Skills management
    function addSkill(category) {
        if (currentContent?.skills?.[category]) {
            currentContent.skills[category] = [
                ...currentContent.skills[category],
                { name: '', level: 50 }
            ];
            handleChange();
        }
    }

    function removeSkill(category, index) {
        if (currentContent?.skills?.[category]) {
            currentContent.skills[category] = currentContent.skills[category].filter((_, i) => i !== index);
            handleChange();
        }
    }

    // Services management
    function addService() {
        currentContent.services = [
            ...currentContent.services,
            { title: '', description: '', icon: 'Star' }
        ];
        handleChange();
    }

    function removeService(index) {
        currentContent.services = currentContent.services.filter((_, i) => i !== index);
        handleChange();
    }

    // Projects management
    function addProject() {
        currentContent.projects = [
            ...currentContent.projects,
            { 
                title: '', 
                description: '', 
                technologies: [], 
                impact: '', 
                link: '', 
                image: '' 
            }
        ];
        handleChange();
    }

    function removeProject(index) {
        currentContent.projects = currentContent.projects.filter((_, i) => i !== index);
        handleChange();
    }

    function addTechnology(projectIndex) {
        currentContent.projects[projectIndex].technologies = [
            ...currentContent.projects[projectIndex].technologies,
            ''
        ];
        handleChange();
    }

    function removeTechnology(projectIndex, techIndex) {
        currentContent.projects[projectIndex].technologies = 
            currentContent.projects[projectIndex].technologies.filter((_, i) => i !== techIndex);
        handleChange();
    }

    // Experience management
    function addExperience() {
        currentContent.experience = [
            ...currentContent.experience,
            {
                company: '',
                position: '',
                period: '',
                location: '',
                description: '',
                achievements: []
            }
        ];
        handleChange();
    }

    function removeExperience(index) {
        currentContent.experience = currentContent.experience.filter((_, i) => i !== index);
        handleChange();
    }

    function addAchievement(expIndex) {
        currentContent.experience[expIndex].achievements = [
            ...currentContent.experience[expIndex].achievements,
            ''
        ];
        handleChange();
    }

    function removeAchievement(expIndex, achIndex) {
        currentContent.experience[expIndex].achievements = 
            currentContent.experience[expIndex].achievements.filter((_, i) => i !== achIndex);
        handleChange();
    }

    // About section list management
    function addToList(section, listType) {
        currentContent.about[listType] = [
            ...currentContent.about[listType],
            ''
        ];
        handleChange();
    }

    function removeFromList(listType, index) {
        currentContent.about[listType] = currentContent.about[listType].filter((_, i) => i !== index);
        handleChange();
    }

    onMount(() => {
        content.init();
    });

    onDestroy(() => {
        unsubscribe();
    });
</script>

{#if currentContent}
<div class="container mx-auto px-4 py-8 max-w-6xl">
    <div class="flex justify-between items-center mb-8">
        <div>
            <h1 class="text-3xl font-bold">Content Management System</h1>
            {#if lastSaved}
                <p class="text-sm text-gray-500">Last saved: {lastSaved.toLocaleString()}</p>
            {/if}
            {#if saveMessage}
                <p class="text-sm {saveMessageType === 'success' ? 'text-green-600' : 'text-red-600'} mt-1">
                    {saveMessage}
                </p>
            {/if}
        </div>
        <div class="flex gap-4">
            <Button variant="ghost" on:click={refreshContent} disabled={isLoading}>
                🔄 Refresh
            </Button>
            {#if isDirty}
                <Button variant="outline" on:click={resetChanges} disabled={isLoading}>Reset Changes</Button>
            {/if}
            <Button variant="default" on:click={updateContent} disabled={!isDirty || isLoading} class="{isDirty ? 'bg-orange-600 hover:bg-orange-700' : ''}">
                {#if isLoading}
                    ⏳ Saving...
                {:else if isDirty}
                    💾 Save Changes*
                {:else}
                    ✅ Saved
                {/if}
            </Button>
        </div>
    </div>

    {#if isDirty}
        <div class="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <p class="text-orange-800 text-sm">
                ⚠️ You have unsaved changes. Click "Save Changes" to apply them to the live site.
            </p>
        </div>
    {/if}

    <div class="space-y-8">
        <!-- Hero Section -->
        <section class="bg-white p-6 rounded-lg shadow-md">
            <h2 class="text-2xl font-semibold mb-4">Hero Section</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label for="hero-title" class="block text-sm font-medium mb-1">Title</label>
                    <input 
                        id="hero-title"
                        type="text" 
                        bind:value={currentContent.hero.title}
                        on:input={handleChange}
                        class="w-full p-2 border rounded"
                    >
                </div>
                <div>
                    <label for="hero-subtitle" class="block text-sm font-medium mb-1">Subtitle</label>
                    <input 
                        id="hero-subtitle"
                        type="text" 
                        bind:value={currentContent.hero.subtitle}
                        on:input={handleChange}
                        class="w-full p-2 border rounded"
                    >
                </div>
                <div class="md:col-span-2">
                    <label for="hero-description" class="block text-sm font-medium mb-1">Description</label>
                    <textarea 
                        id="hero-description"
                        bind:value={currentContent.hero.description}
                        on:input={handleChange}
                        class="w-full p-2 border rounded h-24"
                    ></textarea>
                </div>
                <div class="md:col-span-2">
                    <label for="hero-image" class="block text-sm font-medium mb-1">Profile Image URL</label>
                    <input 
                        id="hero-image"
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
                    <label for="years-exp" class="block text-sm font-medium mb-1">Years Experience</label>
                    <input 
                        id="years-exp"
                        type="number" 
                        bind:value={currentContent.stats.yearsExperience}
                        on:input={handleChange}
                        class="w-full p-2 border rounded"
                    >
                </div>
                <div>
                    <label for="projects-completed" class="block text-sm font-medium mb-1">Projects Completed</label>
                    <input 
                        id="projects-completed"
                        type="number" 
                        bind:value={currentContent.stats.projectsCompleted}
                        on:input={handleChange}
                        class="w-full p-2 border rounded"
                    >
                </div>
                <div>
                    <label for="satisfied-clients" class="block text-sm font-medium mb-1">Satisfied Clients</label>
                    <input 
                        id="satisfied-clients"
                        type="number" 
                        bind:value={currentContent.stats.satisfiedClients}
                        on:input={handleChange}
                        class="w-full p-2 border rounded"
                    >
                </div>
            </div>
        </section>

        <!-- About Section -->
        <section class="bg-white p-6 rounded-lg shadow-md">
            <h2 class="text-2xl font-semibold mb-4">About Section</h2>
            <div class="space-y-4">
                <div>
                    <label for="about-description" class="block text-sm font-medium mb-1">Description</label>
                    <textarea 
                        id="about-description"
                        bind:value={currentContent.about.description}
                        on:input={handleChange}
                        class="w-full p-2 border rounded h-24"
                    ></textarea>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <div class="flex justify-between items-center mb-2">
                            <h3 class="font-semibold">Technical Expertise</h3>
                            <Button size="sm" on:click={() => addToList('about', 'technicalExpertise')}>Add</Button>
                        </div>
                        <div class="space-y-2">
                            {#each currentContent.about.technicalExpertise as item, index}
                                <div class="flex gap-2">
                                    <input 
                                        type="text" 
                                        bind:value={currentContent.about.technicalExpertise[index]}
                                        on:input={handleChange}
                                        class="flex-1 p-2 border rounded"
                                    >
                                    <Button 
                                        size="sm" 
                                        variant="outline" 
                                        class="text-red-600 hover:bg-red-50"
                                        on:click={() => removeFromList('technicalExpertise', index)}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            {/each}
                        </div>
                    </div>
                    
                    <div>
                        <div class="flex justify-between items-center mb-2">
                            <h3 class="font-semibold">Industry Focus</h3>
                            <Button size="sm" on:click={() => addToList('about', 'industryFocus')}>Add</Button>
                        </div>
                        <div class="space-y-2">
                            {#each currentContent.about.industryFocus as item, index}
                                <div class="flex gap-2">
                                    <input 
                                        type="text" 
                                        bind:value={currentContent.about.industryFocus[index]}
                                        on:input={handleChange}
                                        class="flex-1 p-2 border rounded"
                                    >
                                    <Button 
                                        size="sm" 
                                        variant="outline" 
                                        class="text-red-600 hover:bg-red-50"
                                        on:click={() => removeFromList('industryFocus', index)}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            {/each}
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Services Section -->
        <section class="bg-white p-6 rounded-lg shadow-md">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-2xl font-semibold">Services</h2>
                <Button on:click={addService}>Add Service</Button>
            </div>
            <div class="space-y-4">
                {#each currentContent.services as service, index}
                    <div class="border p-4 rounded">
                        <div class="flex justify-between items-center mb-3">
                            <h3 class="font-semibold">Service {index + 1}</h3>
                            <Button 
                                size="sm" 
                                variant="outline" 
                                class="text-red-600 hover:bg-red-50"
                                on:click={() => removeService(index)}
                            >
                                Remove
                            </Button>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label class="block text-sm font-medium mb-1">Title</label>
                                <input 
                                    type="text" 
                                    bind:value={service.title}
                                    on:input={handleChange}
                                    class="w-full p-2 border rounded"
                                >
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1">Icon (Lucide name)</label>
                                <input 
                                    type="text" 
                                    bind:value={service.icon}
                                    on:input={handleChange}
                                    class="w-full p-2 border rounded"
                                    placeholder="e.g. BarChart3, Brain, Database"
                                >
                            </div>
                            <div class="md:col-span-1">
                                <label class="block text-sm font-medium mb-1">Description</label>
                                <textarea 
                                    bind:value={service.description}
                                    on:input={handleChange}
                                    class="w-full p-2 border rounded h-20"
                                ></textarea>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        </section>

        <!-- Projects Section -->
        <section class="bg-white p-6 rounded-lg shadow-md">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-2xl font-semibold">Projects</h2>
                <Button on:click={addProject}>Add Project</Button>
            </div>
            <div class="space-y-6">
                {#each currentContent.projects as project, index}
                    <div class="border p-4 rounded">
                        <div class="flex justify-between items-center mb-3">
                            <h3 class="font-semibold">Project {index + 1}</h3>
                            <Button 
                                size="sm" 
                                variant="outline" 
                                class="text-red-600 hover:bg-red-50"
                                on:click={() => removeProject(index)}
                            >
                                Remove
                            </Button>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label class="block text-sm font-medium mb-1">Title</label>
                                <input 
                                    type="text" 
                                    bind:value={project.title}
                                    on:input={handleChange}
                                    class="w-full p-2 border rounded"
                                >
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1">Impact</label>
                                <input 
                                    type="text" 
                                    bind:value={project.impact}
                                    on:input={handleChange}
                                    class="w-full p-2 border rounded"
                                >
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1">Link</label>
                                <input 
                                    type="text" 
                                    bind:value={project.link}
                                    on:input={handleChange}
                                    class="w-full p-2 border rounded"
                                >
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1">Image URL</label>
                                <input 
                                    type="text" 
                                    bind:value={project.image}
                                    on:input={handleChange}
                                    class="w-full p-2 border rounded"
                                >
                            </div>
                        </div>
                        <div class="mb-4">
                            <label class="block text-sm font-medium mb-1">Description</label>
                            <textarea 
                                bind:value={project.description}
                                on:input={handleChange}
                                class="w-full p-2 border rounded h-20"
                            ></textarea>
                        </div>
                        <div>
                            <div class="flex justify-between items-center mb-2">
                                <label class="block text-sm font-medium">Technologies</label>
                                <Button size="sm" on:click={() => addTechnology(index)}>Add Technology</Button>
                            </div>
                            <div class="space-y-2">
                                {#each project.technologies as tech, techIndex}
                                    <div class="flex gap-2">
                                        <input 
                                            type="text" 
                                            bind:value={project.technologies[techIndex]}
                                            on:input={handleChange}
                                            class="flex-1 p-2 border rounded"
                                        >
                                        <Button 
                                            size="sm" 
                                            variant="outline" 
                                            class="text-red-600 hover:bg-red-50"
                                            on:click={() => removeTechnology(index, techIndex)}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                {/each}
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        </section>

        <!-- Skills Section -->
        <section class="bg-white p-6 rounded-lg shadow-md">
            <h2 class="text-2xl font-semibold mb-4">Skills</h2>
            {#each Object.entries(currentContent.skills) as [category, skills]}
                <div class="mb-8">
                    <div class="flex justify-between items-center mb-3">
                        <h3 class="text-xl font-semibold capitalize">{category.replace(/([A-Z])/g, ' $1').trim()}</h3>
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

        <!-- Experience Section -->
        <section class="bg-white p-6 rounded-lg shadow-md">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-2xl font-semibold">Experience</h2>
                <Button on:click={addExperience}>Add Experience</Button>
            </div>
            <div class="space-y-6">
                {#each currentContent.experience as exp, index}
                    <div class="border p-4 rounded">
                        <div class="flex justify-between items-center mb-3">
                            <h3 class="font-semibold">Experience {index + 1}</h3>
                            <Button 
                                size="sm" 
                                variant="outline" 
                                class="text-red-600 hover:bg-red-50"
                                on:click={() => removeExperience(index)}
                            >
                                Remove
                            </Button>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label class="block text-sm font-medium mb-1">Company</label>
                                <input 
                                    type="text" 
                                    bind:value={exp.company}
                                    on:input={handleChange}
                                    class="w-full p-2 border rounded"
                                >
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1">Position</label>
                                <input 
                                    type="text" 
                                    bind:value={exp.position}
                                    on:input={handleChange}
                                    class="w-full p-2 border rounded"
                                >
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1">Period</label>
                                <input 
                                    type="text" 
                                    bind:value={exp.period}
                                    on:input={handleChange}
                                    class="w-full p-2 border rounded"
                                    placeholder="e.g. 2022 - Present"
                                >
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1">Location</label>
                                <input 
                                    type="text" 
                                    bind:value={exp.location}
                                    on:input={handleChange}
                                    class="w-full p-2 border rounded"
                                >
                            </div>
                        </div>
                        <div class="mb-4">
                            <label class="block text-sm font-medium mb-1">Description</label>
                            <textarea 
                                bind:value={exp.description}
                                on:input={handleChange}
                                class="w-full p-2 border rounded h-20"
                            ></textarea>
                        </div>
                        <div>
                            <div class="flex justify-between items-center mb-2">
                                <label class="block text-sm font-medium">Achievements</label>
                                <Button size="sm" on:click={() => addAchievement(index)}>Add Achievement</Button>
                            </div>
                            <div class="space-y-2">
                                {#each exp.achievements as achievement, achIndex}
                                    <div class="flex gap-2">
                                        <input 
                                            type="text" 
                                            bind:value={exp.achievements[achIndex]}
                                            on:input={handleChange}
                                            class="flex-1 p-2 border rounded"
                                        >
                                        <Button 
                                            size="sm" 
                                            variant="outline" 
                                            class="text-red-600 hover:bg-red-50"
                                            on:click={() => removeAchievement(index, achIndex)}
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                {/each}
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        </section>

        <!-- Contact Section -->
        <section class="bg-white p-6 rounded-lg shadow-md">
            <h2 class="text-2xl font-semibold mb-4">Contact Information</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label for="contact-email" class="block text-sm font-medium mb-1">Email</label>
                    <input 
                        id="contact-email"
                        type="email" 
                        bind:value={currentContent.contact.email}
                        on:input={handleChange}
                        class="w-full p-2 border rounded"
                    >
                </div>
                <div>
                    <label for="contact-phone" class="block text-sm font-medium mb-1">Phone</label>
                    <input 
                        id="contact-phone"
                        type="text" 
                        bind:value={currentContent.contact.phone}
                        on:input={handleChange}
                        class="w-full p-2 border rounded"
                    >
                </div>
                <div>
                    <label for="contact-location" class="block text-sm font-medium mb-1">Location</label>
                    <input 
                        id="contact-location"
                        type="text" 
                        bind:value={currentContent.contact.location}
                        on:input={handleChange}
                        class="w-full p-2 border rounded"
                    >
                </div>
                <div>
                    <label for="contact-github" class="block text-sm font-medium mb-1">GitHub URL</label>
                    <input 
                        id="contact-github"
                        type="text" 
                        bind:value={currentContent.contact.github}
                        on:input={handleChange}
                        class="w-full p-2 border rounded"
                    >
                </div>
                <div class="md:col-span-2">
                    <label for="contact-linkedin" class="block text-sm font-medium mb-1">LinkedIn URL</label>
                    <input 
                        id="contact-linkedin"
                        type="text" 
                        bind:value={currentContent.contact.linkedin}
                        on:input={handleChange}
                        class="w-full p-2 border rounded"
                    >
                </div>
            </div>
        </section>
    </div>
</div>
{:else}
<div class="container mx-auto px-4 py-8">
    <div class="flex justify-center items-center min-h-64">
        <div class="text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p class="text-lg text-gray-500">Loading content...</p>
        </div>
    </div>
</div>
{/if} 