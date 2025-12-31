<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
    import { Switch } from '$lib/components/ui/switch';
    import * as Card from '$lib/components/ui/card';
    import { ArrowLeft, Save, Plus, Trash2, GripVertical } from 'lucide-svelte';
    import RichTextEditor from '$lib/components/RichTextEditor.svelte';
    import ImageUpload from '$lib/components/admin/ImageUpload.svelte';

	export let data;
    export letform;

    let project = data.project;
    let loading = false;

    // Helper for array fields
    function addItem(field: string, template: any) {
        project[field] = [...(project[field] || []), template];
    }

    function removeItem(field: string, index: number) {
        project[field] = project[field].filter((_: any, i: number) => i !== index);
    }
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-4">
			<Button variant="ghost" size="icon" href="/admin/projects">
				<ArrowLeft class="h-5 w-5" />
			</Button>
			<div>
				<h1 class="text-2xl font-bold text-gray-900">
					{project.id ? 'Edit Project' : 'New Project'}
				</h1>
				<p class="text-sm text-gray-500">{project.title || 'Untitled Project'}</p>
			</div>
		</div>
		<Button type="submit" form="project-form" disabled={loading}>
			<Save class="mr-2 h-4 w-4" />
			Save Changes
		</Button>
	</div>

	<!-- Form -->
	<form
		id="project-form"
		method="POST"
		use:enhance={({ formData }) => {
			loading = true;
			// Serialize complex objects before submit
			formData.set('technologies', JSON.stringify(project.technologies));
			formData.set('key_features', JSON.stringify(project.key_features));
			formData.set('challenges_solved', JSON.stringify(project.challenges_solved));
			formData.set('results_achieved', JSON.stringify(project.results_achieved));
			formData.set('images', JSON.stringify(project.images));
			formData.set('videos', JSON.stringify(project.videos));
			formData.set('full_description', project.full_description); // Rich text value

			return async ({ update }) => {
				loading = false;
				await update();
			};
		}}
		class="grid gap-6 lg:grid-cols-3"
	>
		<!-- Main Column -->
		<div class="space-y-6 lg:col-span-2">
			<!-- Basic Info -->
			<Card.Root>
				<Card.Header>
					<Card.Title>Basic Information</Card.Title>
				</Card.Header>
				<Card.Content class="space-y-4">
					<div class="grid gap-4 md:grid-cols-2">
						<div class="space-y-2">
							<Label>Title</Label>
							<Input name="title" bind:value={project.title} required />
						</div>
						<div class="space-y-2">
							<Label>Slug</Label>
							<Input name="slug" bind:value={project.slug} required />
						</div>
					</div>
					<div class="space-y-2">
						<Label>Short Description (Hero)</Label>
						<Textarea name="short_description" bind:value={project.short_description} rows={3} />
					</div>
				</Card.Content>
			</Card.Root>

			<!-- Case Study Content -->
			<Card.Root>
				<Card.Header>
					<Card.Title>Case Study Content</Card.Title>
					<Card.Description>The main story of the project.</Card.Description>
				</Card.Header>
				<Card.Content>
					<div class="min-h-[400px]">
						<RichTextEditor bind:content={project.full_description} />
					</div>
				</Card.Content>
			</Card.Root>

			<!-- Key Features -->
			<Card.Root>
				<Card.Header class="flex flex-row items-center justify-between">
					<Card.Title>Key Features</Card.Title>
					<Button
						variant="outline"
						size="sm"
						onclick={() => addItem('key_features', { title: '', description: '' })}
						type="button"
					>
						<Plus class="mr-2 h-4 w-4" /> Add Feature
					</Button>
				</Card.Header>
				<Card.Content class="space-y-4">
					{#each project.key_features as feature, i}
						<div class="flex items-start gap-4 rounded-lg border p-4">
							<div class="flex-1 space-y-4">
								<Input placeholder="Feature Title" bind:value={feature.title} />
								<Textarea placeholder="Description" bind:value={feature.description} rows={2} />
							</div>
							<Button
								variant="ghost"
								size="icon"
								onclick={() => removeItem('key_features', i)}
								type="button"
							>
								<Trash2 class="h-4 w-4 text-red-500" />
							</Button>
						</div>
					{/each}
				</Card.Content>
			</Card.Root>

			<!-- Challenges -->
			<Card.Root>
				<Card.Header class="flex flex-row items-center justify-between">
					<Card.Title>Challenges & Solutions</Card.Title>
					<Button
						variant="outline"
						size="sm"
						onclick={() => addItem('challenges_solved', { challenge: '', solution: '' })}
						type="button"
					>
						<Plus class="mr-2 h-4 w-4" /> Add Challenge
					</Button>
				</Card.Header>
				<Card.Content class="space-y-4">
					{#each project.challenges_solved as item, i}
						<div class="flex items-start gap-4 rounded-lg border p-4">
							<div class="flex-1 space-y-4">
								<Input placeholder="Challenge" bind:value={item.challenge} />
								<Textarea placeholder="Solution" bind:value={item.solution} rows={2} />
							</div>
							<Button
								variant="ghost"
								size="icon"
								onclick={() => removeItem('challenges_solved', i)}
								type="button"
							>
								<Trash2 class="h-4 w-4 text-red-500" />
							</Button>
						</div>
					{/each}
				</Card.Content>
			</Card.Root>
		</div>

		<!-- Sidebar -->
		<div class="space-y-6">
			<!-- Publishing -->
			<Card.Root>
				<Card.Header>
					<Card.Title>Publishing</Card.Title>
				</Card.Header>
				<Card.Content class="space-y-4">
					<div class="flex items-center justify-between">
						<Label>Status</Label>
						<select
							name="status"
							bind:value={project.status}
							class="border-input bg-background flex h-10 w-full rounded-md border px-3 py-2 text-sm"
						>
							<option value="draft">Draft</option>
							<option value="published">Published</option>
							<option value="archived">Archived</option>
						</select>
					</div>
					<div class="space-y-2">
						<Label>Project Date</Label>
						<Input type="date" name="project_date" bind:value={project.project_date} />
					</div>
				</Card.Content>
			</Card.Root>

			<!-- Metadata -->
			<Card.Root>
				<Card.Header>
					<Card.Title>Metadata</Card.Title>
				</Card.Header>
				<Card.Content class="space-y-4">
					<div class="space-y-2">
						<Label>Category</Label>
						<Input name="category" bind:value={project.category} />
					</div>
					<div class="space-y-2">
						<Label>Live Demo URL</Label>
						<Input
							name="live_demo_url"
							bind:value={project.live_demo_url}
							placeholder="https://..."
						/>
					</div>
					<div class="space-y-2">
						<Label>GitHub URL</Label>
						<Input name="github_url" bind:value={project.github_url} placeholder="https://..." />
					</div>
				</Card.Content>
			</Card.Root>

			<!-- Featured Image -->
			<Card.Root>
				<Card.Header>
					<Card.Title>Featured Image</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="space-y-4">
						<ImageUpload bind:value={project.featured_image} />
						<Input type="hidden" name="featured_image" bind:value={project.featured_image} />
					</div>
				</Card.Content>
			</Card.Root>

			<!-- Technologies -->
			<Card.Root>
				<Card.Header>
					<Card.Title>Technologies</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="space-y-2">
						{#each project.technologies as tech, i}
							<div class="flex gap-2">
								<Input bind:value={project.technologies[i]} />
								<Button
									variant="ghost"
									size="icon"
									onclick={() => removeItem('technologies', i)}
									type="button"
								>
									<Trash2 class="h-4 w-4" />
								</Button>
							</div>
						{/each}
						<Button
							variant="outline"
							size="sm"
							class="w-full"
							onclick={() => addItem('technologies', '')}
							type="button"
						>
							<Plus class="mr-2 h-4 w-4" /> Add Tech
						</Button>
					</div>
				</Card.Content>
			</Card.Root>
		</div>
	</form>
</div>
