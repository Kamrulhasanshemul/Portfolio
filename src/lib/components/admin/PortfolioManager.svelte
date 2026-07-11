<svelte:options runes={true} />

<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Label } from '$lib/components/ui/label';
	import * as Card from '$lib/components/ui/card';
	import { Trash2, Plus } from '@lucide/svelte';
	import type { Content, Service, Project } from '$lib/types/content';

	let { content = $bindable(), onChange } = $props<{
		content: Content;
		onChange: () => void;
	}>();

	function addService() {
		content.services = [...content.services, { title: '', description: '', icon: 'Circle' }];
		onChange();
	}

	function removeService(index: number) {
		content.services = content.services.filter((_: Service, i: number) => i !== index);
		onChange();
	}

	function addProject() {
		content.projects = [
			...content.projects,
			{ title: '', description: '', technologies: [], link: '', impact: '', image: '' }
		];
		onChange();
	}

	function removeProject(index: number) {
		content.projects = content.projects.filter((_: Project, i: number) => i !== index);
		onChange();
	}

	function addTechnology(projectIndex: number) {
		content.projects[projectIndex].technologies = [
			...content.projects[projectIndex].technologies,
			''
		];
		onChange();
	}

	function removeTechnology(projectIndex: number, techIndex: number) {
		content.projects[projectIndex].technologies = content.projects[
			projectIndex
		].technologies.filter((_: string, i: number) => i !== techIndex);
		onChange();
	}
</script>

<div class="grid max-w-4xl gap-8">
	<!-- Services Section -->
	<section>
		<div class="mb-4 flex items-center justify-between">
			<h3 class="text-lg font-medium">Services</h3>
			<Button onclick={addService} size="sm"><Plus class="mr-2 h-4 w-4" /> Add Service</Button>
		</div>

		<div class="grid gap-4">
			{#each content.services as service, i (i)}
				<Card.Root class="border-0 shadow-sm ring-1 ring-gray-200">
					<Card.Content class="pt-6">
						<div class="mb-2 flex justify-end">
							<Button variant="ghost" size="icon" onclick={() => removeService(i)}>
								<Trash2 class="h-4 w-4 text-red-500" />
							</Button>
						</div>
						<div class="grid gap-4">
							<div>
								<Label>Title</Label>
								<Input bind:value={service.title} oninput={onChange} class="mt-1" />
							</div>
							<div>
								<Label>Icon Name (Lucide)</Label>
								<Input bind:value={service.icon} oninput={onChange} class="mt-1" />
							</div>
							<div>
								<Label>Description</Label>
								<Textarea bind:value={service.description} oninput={onChange} class="mt-1" />
							</div>
						</div>
					</Card.Content>
				</Card.Root>
			{/each}
		</div>
	</section>

	<!-- Projects Section -->
	<section>
		<div class="mb-4 flex items-center justify-between">
			<h3 class="text-lg font-medium">Projects</h3>
			<Button onclick={addProject} size="sm"><Plus class="mr-2 h-4 w-4" /> Add Project</Button>
		</div>

		<div class="grid gap-4">
			{#each content.projects as project, i (i)}
				<Card.Root class="border-0 shadow-sm ring-1 ring-gray-200">
					<Card.Content class="pt-6">
						<div class="mb-2 flex justify-end">
							<Button variant="ghost" size="icon" onclick={() => removeProject(i)}>
								<Trash2 class="h-4 w-4 text-red-500" />
							</Button>
						</div>
						<div class="grid gap-4">
							<div class="grid gap-4 md:grid-cols-2">
								<div>
									<Label>Project Title</Label>
									<Input bind:value={project.title} oninput={onChange} class="mt-1" />
								</div>
								<div>
									<Label>Link</Label>
									<Input bind:value={project.link} oninput={onChange} class="mt-1" />
								</div>
							</div>
							<div>
								<Label>Description</Label>
								<Textarea bind:value={project.description} oninput={onChange} class="mt-1" />
							</div>
							<div>
								<Label>Impact/Result</Label>
								<Input bind:value={project.impact} oninput={onChange} class="mt-1" />
							</div>

							<div>
								<Label>Technologies</Label>
								<div class="mt-2 flex flex-wrap gap-2">
									{#each project.technologies as _tech, tIndex (tIndex)}
										<div class="flex items-center gap-1">
											<Input
												bind:value={project.technologies[tIndex]}
												oninput={onChange}
												class="h-8 w-32 text-sm"
											/>
											<button
												onclick={() => removeTechnology(i, tIndex)}
												class="text-red-500 hover:text-red-700"
											>
												<Trash2 class="h-3 w-3" />
											</button>
										</div>
									{/each}
									<Button variant="outline" size="sm" class="h-8" onclick={() => addTechnology(i)}>
										<Plus class="h-3 w-3" />
									</Button>
								</div>
							</div>
						</div>
					</Card.Content>
				</Card.Root>
			{/each}
		</div>
	</section>
</div>
