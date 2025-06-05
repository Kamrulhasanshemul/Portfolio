<script lang="ts">
    import { content } from '$lib/stores/content';
    import { Button } from '$lib/components/ui/button';
    import { onMount, onDestroy } from 'svelte';
    import type { Content } from '$lib/types/content';

    let currentContent: Content | null = null;
    let isDirty = false;
    let lastSaved: Date | null = null;
    let isLoading = false;
    let saveMessage = '';
    let saveMessageType: 'success' | 'error' = 'success';

    // Subscribe to content changes
    const unsubscribe = content.subscribe((value: Content | null) => {
        if (value && Object.keys(value).length > 0) {
            console.log('Admin received content update with sections:', Object.keys(value));
            
            // Ensure all required sections exist
            const requiredSections = ['hero', 'stats', 'about', 'services', 'projects', 'skills', 'experience', 'contact'];
            const hasAllSections = requiredSections.every(section => value[section as keyof Content]);
            
            if (!hasAllSections) {
                console.warn('Incomplete content received in admin, some sections missing');
                return;
            }
            
            currentContent = JSON.parse(JSON.stringify(value)); // Deep copy to track changes
            console.log('Admin content updated successfully');
        }
    });

    async function updateContent() {
        if (!currentContent) return;
        
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
        const unsubscribeReset = content.subscribe((value: Content | null) => {
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
    function addSkill(category: string) {
        if (currentContent?.skills?.[category as keyof typeof currentContent.skills]) {
            (currentContent.skills[category as keyof typeof currentContent.skills] as any[]) = [
                ...(currentContent.skills[category as keyof typeof currentContent.skills] as any[]),
                { name: '', level: 50 }
            ];
            handleChange();
        }
    }

    function removeSkill(category: string, index: number) {
        if (currentContent?.skills?.[category as keyof typeof currentContent.skills]) {
            (currentContent.skills[category as keyof typeof currentContent.skills] as any[]) = 
                (currentContent.skills[category as keyof typeof currentContent.skills] as any[]).filter((_, i) => i !== index);
            handleChange();
        }
    }

    // Services management
    function addService() {
        if (!currentContent) return;
        currentContent.services = [
            ...currentContent.services,
            { title: '', description: '', icon: 'Star' }
        ];
        handleChange();
    }

    function removeService(index: number) {
        if (!currentContent) return;
        currentContent.services = currentContent.services.filter((_, i) => i !== index);
        handleChange();
    }

    // Projects management
    function addProject() {
        if (!currentContent) return;
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

    function removeProject(index: number) {
        if (!currentContent) return;
        currentContent.projects = currentContent.projects.filter((_, i) => i !== index);
        handleChange();
    }

    function addTechnology(projectIndex: number) {
        if (!currentContent) return;
        currentContent.projects[projectIndex].technologies = [
            ...currentContent.projects[projectIndex].technologies,
            ''
        ];
        handleChange();
    }

    function removeTechnology(projectIndex: number, techIndex: number) {
        if (!currentContent) return;
        currentContent.projects[projectIndex].technologies = 
            currentContent.projects[projectIndex].technologies.filter((_, i) => i !== techIndex);
        handleChange();
    }

    // Experience management
    function addExperience() {
        if (!currentContent) return;
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

    function removeExperience(index: number) {
        if (!currentContent) return;
        currentContent.experience = currentContent.experience.filter((_, i) => i !== index);
        handleChange();
    }

    function addAchievement(expIndex: number) {
        if (!currentContent) return;
        currentContent.experience[expIndex].achievements = [
            ...currentContent.experience[expIndex].achievements,
            ''
        ];
        handleChange();
    }

    function removeAchievement(expIndex: number, achIndex: number) {
        if (!currentContent) return;
        currentContent.experience[expIndex].achievements = 
            currentContent.experience[expIndex].achievements.filter((_, i) => i !== achIndex);
        handleChange();
    }

    // About section list management
    function addToList(section: string, listType: 'technicalExpertise' | 'industryFocus') {
        if (!currentContent) return;
        currentContent.about[listType] = [
            ...currentContent.about[listType],
            ''
        ];
        handleChange();
    }

    function removeFromList(listType: 'technicalExpertise' | 'industryFocus', index: number) {
        if (!currentContent) return;
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
            <h2 class="text-2xl font-semibold mb-4">Statistics</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label for="years-experience" class="block text-sm font-medium mb-1">Years Experience</label>
                    <input 
                        id="years-experience"
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
                
                <!-- Technical Expertise -->
                <div>
                    <div class="flex justify-between items-center mb-2">
                        <h3 class="font-semibold">Technical Expertise</h3>
                        <Button size="sm" on:click={() => addToList('about', 'technicalExpertise')}>Add</Button>
                    </div>
                    <div class="space-y-2">
                        {#each currentContent.about.technicalExpertise as expertise, index}
                            <div class="flex gap-2">
                                <input 
                                    type="text" 
                                    bind:value={currentContent.about.technicalExpertise[index]}
                                    on:input={handleChange}
                                    class="flex-1 p-2 border rounded"
                                    placeholder="Technical expertise item"
                                >
                                <Button 
                                    size="sm" 
                                    variant="destructive"
                                    class="text-red-600 hover:bg-red-50"
                                    on:click={() => removeFromList('technicalExpertise', index)}
                                >
                                    Remove
                                </Button>
                            </div>
                        {/each}
                    </div>
                </div>

                <!-- Industry Focus -->
                <div>
                    <div class="flex justify-between items-center mb-2">
                        <h3 class="font-semibold">Industry Focus</h3>
                        <Button size="sm" on:click={() => addToList('about', 'industryFocus')}>Add</Button>
                    </div>
                    <div class="space-y-2">
                        {#each currentContent.about.industryFocus as industry, index}
                            <div class="flex gap-2">
                                <input 
                                    type="text" 
                                    bind:value={currentContent.about.industryFocus[index]}
                                    on:input={handleChange}
                                    class="flex-1 p-2 border rounded"
                                    placeholder="Industry focus item"
                                >
                                <Button 
                                    size="sm" 
                                    variant="destructive"
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
        </section>

        <!-- Services Section -->
        <section class="bg-white p-6 rounded-lg shadow-md">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-2xl font-semibold">Services</h2>
                <Button on:click={addService}>Add Service</Button>
            </div>
            
            <div class="space-y-6">
                {#each currentContent.services as service, index}
                    <div class="p-4 border rounded-lg">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="font-semibold">Service {index + 1}</h3>
                            <Button 
                                size="sm" 
                                variant="destructive"
                                class="text-red-600 hover:bg-red-50"
                                on:click={() => removeService(index)}
                            >
                                Remove
                            </Button>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label for="service-title-{index}" class="block text-sm font-medium mb-1">Title</label>
                                <input 
                                    id="service-title-{index}"
                                    type="text" 
                                    bind:value={service.title}
                                    on:input={handleChange}
                                    class="w-full p-2 border rounded"
                                >
                            </div>
                            <div>
                                <label for="service-icon-{index}" class="block text-sm font-medium mb-1">Icon (Lucide name)</label>
                                <input 
                                    id="service-icon-{index}"
                                    type="text" 
                                    bind:value={service.icon}
                                    on:input={handleChange}
                                    class="w-full p-2 border rounded"
                                >
                            </div>
                            <div class="md:col-span-1">
                                <label for="service-description-{index}" class="block text-sm font-medium mb-1">Description</label>
                                <textarea 
                                    id="service-description-{index}"
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
                    <div class="p-4 border rounded-lg">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="font-semibold">Project {index + 1}</h3>
                            <Button 
                                size="sm" 
                                variant="destructive"
                                class="text-red-600 hover:bg-red-50"
                                on:click={() => removeProject(index)}
                            >
                                Remove
                            </Button>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label for="project-title-{index}" class="block text-sm font-medium mb-1">Title</label>
                                <input 
                                    id="project-title-{index}"
                                    type="text" 
                                    bind:value={project.title}
                                    on:input={handleChange}
                                    class="w-full p-2 border rounded"
                                >
                            </div>
                            <div>
                                <label for="project-impact-{index}" class="block text-sm font-medium mb-1">Impact</label>
                                <input 
                                    id="project-impact-{index}"
                                    type="text" 
                                    bind:value={project.impact}
                                    on:input={handleChange}
                                    class="w-full p-2 border rounded"
                                >
                            </div>
                            <div>
                                <label for="project-link-{index}" class="block text-sm font-medium mb-1">Link</label>
                                <input 
                                    id="project-link-{index}"
                                    type="text" 
                                    bind:value={project.link}
                                    on:input={handleChange}
                                    class="w-full p-2 border rounded"
                                >
                            </div>
                            <div>
                                <label for="project-image-{index}" class="block text-sm font-medium mb-1">Image URL</label>
                                <input 
                                    id="project-image-{index}"
                                    type="text" 
                                    bind:value={project.image}
                                    on:input={handleChange}
                                    class="w-full p-2 border rounded"
                                >
                            </div>
                        </div>
                        <div class="mb-4">
                            <label for="project-description-{index}" class="block text-sm font-medium mb-1">Description</label>
                            <textarea 
                                id="project-description-{index}"
                                bind:value={project.description}
                                on:input={handleChange}
                                class="w-full p-2 border rounded h-20"
                            ></textarea>
                        </div>
                        <div>
                            <div class="flex justify-between items-center mb-2">
                                <label for="project-technologies-{index}" class="block text-sm font-medium">Technologies</label>
                                <Button size="sm" on:click={() => addTechnology(index)}>Add Technology</Button>
                            </div>
                            <div class="space-y-2">
                                {#each project.technologies as tech, techIndex}
                                    <div class="flex gap-2">
                                        <input 
                                            type="text" 
                                            bind:value={currentContent.projects[index].technologies[techIndex]}
                                            on:input={handleChange}
                                            class="flex-1 p-2 border rounded"
                                            placeholder="Technology"
                                        >
                                        <Button 
                                            size="sm" 
                                            variant="destructive"
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
            
            <div class="space-y-6">
                {#each Object.entries(currentContent.skills) as [category, skillList]}
                    <div class="p-4 border rounded-lg">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="text-xl font-semibold capitalize">{category.replace(/([A-Z])/g, ' $1').trim()}</h3>
                            <Button variant="outline" size="sm" on:click={() => addSkill(category)}>
                                Add Skill
                            </Button>
                        </div>
                        <div class="space-y-3">
                            {#each skillList as skill, index}
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                    <input 
                                        type="text" 
                                        bind:value={skill.name}
                                        on:input={handleChange}
                                        placeholder="Skill name"
                                        class="p-2 border rounded"
                                    >
                                    <div class="flex items-center gap-2">
                                        <input 
                                            type="range" 
                                            min="0" 
                                            max="100" 
                                            bind:value={skill.level}
                                            on:input={handleChange}
                                            class="flex-1"
                                        >
                                        <span class="text-sm w-12">{skill.level}%</span>
                                    </div>
                                    <Button 
                                        size="sm" 
                                        variant="destructive"
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
            </div>
        </section>

        <!-- Experience Section -->
        <section class="bg-white p-6 rounded-lg shadow-md">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-2xl font-semibold">Experience</h2>
                <Button on:click={addExperience}>Add Experience</Button>
            </div>
            
            <div class="space-y-6">
                {#each currentContent.experience as exp, index}
                    <div class="p-4 border rounded-lg">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="font-semibold">Experience {index + 1}</h3>
                            <Button 
                                size="sm" 
                                variant="destructive"
                                class="text-red-600 hover:bg-red-50"
                                on:click={() => removeExperience(index)}
                            >
                                Remove
                            </Button>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label for="exp-company-{index}" class="block text-sm font-medium mb-1">Company</label>
                                <input 
                                    id="exp-company-{index}"
                                    type="text" 
                                    bind:value={exp.company}
                                    on:input={handleChange}
                                    class="w-full p-2 border rounded"
                                >
                            </div>
                            <div>
                                <label for="exp-position-{index}" class="block text-sm font-medium mb-1">Position</label>
                                <input 
                                    id="exp-position-{index}"
                                    type="text" 
                                    bind:value={exp.position}
                                    on:input={handleChange}
                                    class="w-full p-2 border rounded"
                                >
                            </div>
                            <div>
                                <label for="exp-period-{index}" class="block text-sm font-medium mb-1">Period</label>
                                <input 
                                    id="exp-period-{index}"
                                    type="text" 
                                    bind:value={exp.period}
                                    on:input={handleChange}
                                    class="w-full p-2 border rounded"
                                >
                            </div>
                            <div>
                                <label for="exp-location-{index}" class="block text-sm font-medium mb-1">Location</label>
                                <input 
                                    id="exp-location-{index}"
                                    type="text" 
                                    bind:value={exp.location}
                                    on:input={handleChange}
                                    class="w-full p-2 border rounded"
                                >
                            </div>
                        </div>
                        <div class="mb-4">
                            <label for="exp-description-{index}" class="block text-sm font-medium mb-1">Description</label>
                            <textarea 
                                id="exp-description-{index}"
                                bind:value={exp.description}
                                on:input={handleChange}
                                class="w-full p-2 border rounded h-20"
                            ></textarea>
                        </div>
                        <div>
                            <div class="flex justify-between items-center mb-2">
                                <label for="exp-achievements-{index}" class="block text-sm font-medium">Achievements</label>
                                <Button size="sm" on:click={() => addAchievement(index)}>Add Achievement</Button>
                            </div>
                            <div class="space-y-2">
                                {#each exp.achievements as achievement, achIndex}
                                    <div class="flex gap-2">
                                        <input 
                                            type="text" 
                                            bind:value={currentContent.experience[index].achievements[achIndex]}
                                            on:input={handleChange}
                                            class="flex-1 p-2 border rounded"
                                            placeholder="Achievement"
                                        >
                                        <Button 
                                            size="sm" 
                                            variant="destructive"
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