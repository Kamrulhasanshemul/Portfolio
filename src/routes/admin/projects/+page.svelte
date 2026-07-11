<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Plus, Pencil, ExternalLink, Trash2 } from '@lucide/svelte';

	let { data } = $props();
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold tracking-tight text-gray-900">Projects</h1>
			<p class="mt-2 text-gray-600">Manage your project case studies and portfolio items.</p>
		</div>
		<Button href="/admin/projects/new">
			<Plus class="mr-2 h-4 w-4" />
			New Project
		</Button>
	</div>

	<div class="rounded-lg border bg-white shadow-sm">
		<div class="overflow-x-auto">
			<table class="w-full text-left text-sm">
				<thead class="bg-gray-50 text-gray-500">
					<tr>
						<th class="px-6 py-4 font-medium">Title</th>
						<th class="px-6 py-4 font-medium">Category</th>
						<th class="px-6 py-4 font-medium">Status</th>
						<th class="px-6 py-4 font-medium">Date</th>
						<th class="px-6 py-4 text-right font-medium">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-100">
					{#each data.projects as project}
						<tr class="hover:bg-gray-50/50">
							<td class="px-6 py-4 font-medium text-gray-900">{project.title}</td>
							<td class="px-6 py-4 text-gray-600">
								<span
									class="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset"
								>
									{project.category}
								</span>
							</td>
							<td class="px-6 py-4">
								{#if project.status === 'published'}
									<span
										class="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset"
										>Published</span
									>
								{:else}
									<span
										class="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-500/10 ring-inset"
										>Draft</span
									>
								{/if}
							</td>
							<td class="px-6 py-4 text-gray-600">
								{project.project_date
									? new Date(project.project_date).toLocaleDateString('en-US', {
											year: 'numeric',
											month: 'short',
											day: 'numeric'
										})
									: '-'}
							</td>
							<td class="px-6 py-4 text-right">
								<div class="flex justify-end gap-2">
									<Button
										variant="ghost"
										size="icon"
										href={`/projects/${project.slug}`}
										target="_blank"
										title="View Live"
									>
										<ExternalLink class="h-4 w-4 text-gray-400" />
									</Button>
									<Button
										variant="ghost"
										size="icon"
										href={`/admin/projects/${project.id}`}
										title="Edit"
									>
										<Pencil class="h-4 w-4 text-blue-600" />
									</Button>
									<form
										action={`/admin/projects/${project.id}?/delete`}
										method="POST"
										class="inline"
									>
										<Button
											variant="ghost"
											size="icon"
											type="submit"
											title="Delete"
											class="hover:bg-red-50"
											onclick={(e) => {
												if (!confirm('Are you sure you want to delete this project?')) {
													e.preventDefault();
												}
											}}
										>
											<Trash2 class="h-4 w-4 text-red-500" />
										</Button>
									</form>
								</div>
							</td>
						</tr>
					{:else}
						<tr>
							<td colspan="5" class="px-6 py-12 text-center text-gray-500">
								No projects found. Sync them from your resume or create one.
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</div>
