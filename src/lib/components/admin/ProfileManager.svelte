<svelte:options runes={true} />

<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Label } from '$lib/components/ui/label';
	import * as Card from '$lib/components/ui/card';
	import { Trash2, Plus } from '@lucide/svelte';
	import ImageUpload from './ImageUpload.svelte';
	import FileUpload from './FileUpload.svelte';
	import type { Content } from '$lib/types/content';

	let { content = $bindable(), onChange } = $props<{
		content: Content;
		onChange: () => void;
	}>();

	function addToList(section: 'about', listName: 'technicalExpertise' | 'industryFocus') {
		content[section][listName] = [...content[section][listName], ''];
		onChange();
	}

	function removeFromList(listName: 'technicalExpertise' | 'industryFocus', index: number) {
		content.about[listName] = content.about[listName].filter((_: string, i: number) => i !== index);
		onChange();
	}
</script>

<div class="grid max-w-4xl gap-8">
	<section>
		<h3 class="mb-4 text-lg font-medium">Hero Section</h3>
		<Card.Root class="border-0 shadow-sm ring-1 ring-gray-200">
			<Card.Content class="space-y-4 pt-6">
				<div class="grid gap-4 md:grid-cols-2">
					<div>
						<Label>Main Heading (Title)</Label><Input
							bind:value={content.hero.title}
							oninput={onChange}
							placeholder="e.g. Data Analyst"
							class="mt-1"
						/>
					</div>
					<div>
						<Label>Sub Heading (Subtitle)</Label><Input
							bind:value={content.hero.subtitle}
							oninput={onChange}
							placeholder="e.g. Turning Numbers into Insights"
							class="mt-1"
						/>
					</div>
				</div>
				<div>
					<Label>Description</Label><Textarea
						bind:value={content.hero.description}
						oninput={onChange}
						class="mt-1"
					/>
				</div>
				<div>
					<Label>Profile Image</Label>
					<div class="mt-1">
						<ImageUpload
							bind:value={content.hero.profileImage}
							path="profile"
							label="Upload Profile Picture"
							{onChange}
						/>
					</div>
				</div>
			</Card.Content>
		</Card.Root>
	</section>

	<section>
		<h3 class="mb-4 text-lg font-medium">About</h3>
		<Card.Root class="border-0 shadow-sm ring-1 ring-gray-200">
			<Card.Content class="space-y-4 pt-6">
				<div>
					<Label>Description</Label><Textarea
						bind:value={content.about.description}
						oninput={onChange}
						class="mt-1 min-h-[150px]"
					/>
				</div>
				<!-- Technical skills list -->
				<div>
					<Label>Technical Expertise</Label>
					{#each content.about.technicalExpertise as item, i}
						<div class="mt-2 flex gap-2">
							<Input bind:value={content.about.technicalExpertise[i]} oninput={onChange} />
							<Button
								variant="ghost"
								size="icon"
								onclick={() => removeFromList('technicalExpertise', i)}
								><Trash2 class="h-4 w-4" /></Button
							>
						</div>
					{/each}
					<Button
						variant="outline"
						size="sm"
						class="mt-2"
						onclick={() => addToList('about', 'technicalExpertise')}
						><Plus class="mr-2 h-4 w-4" /> Add</Button
					>
				</div>

				<!-- Industry Focus -->
				<div>
					<Label>Industry Focus</Label>
					{#each content.about.industryFocus as item, i}
						<div class="mt-2 flex gap-2">
							<Input bind:value={content.about.industryFocus[i]} oninput={onChange} />
							<Button variant="ghost" size="icon" onclick={() => removeFromList('industryFocus', i)}
								><Trash2 class="h-4 w-4" /></Button
							>
						</div>
					{/each}
					<Button
						variant="outline"
						size="sm"
						class="mt-2"
						onclick={() => addToList('about', 'industryFocus')}
						><Plus class="mr-2 h-4 w-4" /> Add</Button
					>
				</div>
			</Card.Content>
		</Card.Root>
	</section>

	<section>
		<h3 class="mb-4 text-lg font-medium">Contact Information</h3>
		<Card.Root class="border-0 shadow-sm ring-1 ring-gray-200">
			<Card.Content class="space-y-4 pt-6">
				<div class="grid gap-6 md:grid-cols-2">
					<div class="space-y-4">
						<div>
							<Label>Email</Label><Input
								bind:value={content.contact.email}
								oninput={onChange}
								class="mt-1"
							/>
						</div>
						<div>
							<Label>Phone</Label><Input
								bind:value={content.contact.phone}
								oninput={onChange}
								class="mt-1"
							/>
						</div>
						<div>
							<Label>Location</Label><Input
								bind:value={content.contact.location}
								oninput={onChange}
								class="mt-1"
							/>
						</div>
					</div>
					<div class="space-y-4">
						<div>
							<Label>GitHub URL</Label><Input
								bind:value={content.contact.github}
								oninput={onChange}
								class="mt-1"
							/>
						</div>
						<div>
							<Label>LinkedIn URL</Label><Input
								bind:value={content.contact.linkedin}
								oninput={onChange}
								class="mt-1"
							/>
						</div>
						<div>
							<Label>Resume (PDF/Doc)</Label>
							<div class="mt-1">
								<FileUpload
									bind:value={content.contact.resumeUrl}
									label="Upload Resume"
									{onChange}
								/>
							</div>
						</div>
					</div>
				</div>
			</Card.Content>
		</Card.Root>
	</section>
</div>
