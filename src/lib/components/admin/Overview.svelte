<svelte:options runes={true} />

<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import type { Content } from '$lib/types/content';

	let { content = $bindable(), onChange } = $props<{
		content: Content;
		onChange: () => void;
	}>();
</script>

<div class="grid gap-6">
	<section>
		<h2 class="mb-4 text-lg font-medium text-gray-900">Key Statistics</h2>
		<Card.Root class="border-0 shadow-sm ring-1 ring-gray-200">
			<Card.Content class="pt-6">
				<div class="grid gap-6 lg:grid-cols-3">
					<div>
						<Label class="text-gray-500">Years Experience</Label>
						<Input
							type="number"
							bind:value={content.stats.yearsExperience}
							oninput={onChange}
							class="mt-1"
						/>
					</div>
					<div>
						<Label class="text-gray-500">Projects Completed</Label>
						<Input
							type="number"
							bind:value={content.stats.projectsCompleted}
							oninput={onChange}
							class="mt-1"
						/>
					</div>
					<div>
						<Label class="text-gray-500">Satisfied Clients</Label>
						<Input
							type="number"
							bind:value={content.stats.satisfiedClients}
							oninput={onChange}
							class="mt-1"
						/>
					</div>
				</div>
			</Card.Content>
		</Card.Root>
	</section>
</div>
