<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Users, Eye as EyeIcon, TrendingUp, Briefcase } from '@lucide/svelte';
	import type { Content } from '$lib/types/content';

	let { content = $bindable(), onChange } = $props<{
		content: Content;
		onChange: () => void;
	}>();

	// Mock Analytics Data (in a real app, this would come from an API)
	const analytics = {
		totalViews: 12543,
		monthlyViews: 4230,
		engagementRate: 12.5,
		recentActivities: [
			{ action: 'New Portfolio Project', date: '2 hours ago' },
			{ action: 'Profile Updated', date: '1 day ago' },
			{ action: 'Blog Post Published', date: '3 days ago' }
		]
	};
</script>

<div class="space-y-8">
	<!-- Analytics Overview -->
	<section>
		<h2 class="mb-4 text-xl font-semibold text-gray-800">Analytics Overview</h2>
		<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<Card.Root class="border-0 shadow-sm ring-1 ring-gray-100">
				<Card.Content class="flex items-center gap-4 p-6">
					<div class="rounded-full bg-blue-50 p-3 text-blue-600">
						<EyeIcon class="h-6 w-6" />
					</div>
					<div>
						<p class="text-sm font-medium text-gray-500">Total Views</p>
						<p class="text-2xl font-bold text-gray-900">{analytics.totalViews.toLocaleString()}</p>
					</div>
				</Card.Content>
			</Card.Root>

			<Card.Root class="border-0 shadow-sm ring-1 ring-gray-100">
				<Card.Content class="flex items-center gap-4 p-6">
					<div class="rounded-full bg-green-50 p-3 text-green-600">
						<Users class="h-6 w-6" />
					</div>
					<div>
						<p class="text-sm font-medium text-gray-500">Monthly Visitors</p>
						<p class="text-2xl font-bold text-gray-900">
							{analytics.monthlyViews.toLocaleString()}
						</p>
					</div>
				</Card.Content>
			</Card.Root>

			<Card.Root class="border-0 shadow-sm ring-1 ring-gray-100">
				<Card.Content class="flex items-center gap-4 p-6">
					<div class="rounded-full bg-purple-50 p-3 text-purple-600">
						<TrendingUp class="h-6 w-6" />
					</div>
					<div>
						<p class="text-sm font-medium text-gray-500">Engagement</p>
						<p class="text-2xl font-bold text-gray-900">{analytics.engagementRate}%</p>
					</div>
				</Card.Content>
			</Card.Root>

			<Card.Root class="border-0 shadow-sm ring-1 ring-gray-100">
				<Card.Content class="flex items-center gap-4 p-6">
					<div class="rounded-full bg-orange-50 p-3 text-orange-600">
						<Briefcase class="h-6 w-6" />
					</div>
					<div>
						<p class="text-sm font-medium text-gray-500">Projects</p>
						<p class="text-2xl font-bold text-gray-900">{content.stats.projectsCompleted}</p>
					</div>
				</Card.Content>
			</Card.Root>
		</div>
	</section>

	<!-- Quick Stats Update -->
	<section>
		<h2 class="mb-4 text-xl font-semibold text-gray-800">Public Stats</h2>
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
