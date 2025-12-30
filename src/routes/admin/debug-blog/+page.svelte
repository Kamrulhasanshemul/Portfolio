<script lang="ts">
	export let data;
	const { debugInfo } = data;
</script>

<div class="p-8">
	<h1 class="mb-4 text-2xl font-bold">Blog Debug Info</h1>

	<div class="space-y-4">
		<div class="rounded border bg-gray-50 p-4">
			<h2 class="font-semibold">Environment</h2>
			<p>URL: {debugInfo.envUrl} ({debugInfo.urlValue})</p>
			<p>Key: {debugInfo.envKey}</p>
		</div>

		<div class="rounded border bg-gray-50 p-4">
			<h2 class="font-semibold">Database Connection</h2>
			<p>
				Public Status: <span
					class={debugInfo.connection.includes('Success') ? 'text-green-600' : 'text-red-600'}
					>{debugInfo.connection}</span
				>
			</p>
			<p>
				Admin Status: <span
					class={debugInfo.adminConnection.includes('Success') ? 'text-green-600' : 'text-red-600'}
					>{debugInfo.adminConnection}</span
				>
			</p>
			<p>Service Key Present: {debugInfo.serviceKeyAvailable ? 'Yes' : 'No'}</p>
		</div>

		{#if debugInfo.error}
			<div class="rounded border bg-red-50 p-4 text-red-700">
				<h2 class="font-bold">Error</h2>
				<pre>{JSON.stringify(debugInfo.error, null, 2)}</pre>
			</div>
		{/if}

		<div class="rounded border bg-gray-50 p-4">
			<h2 class="font-semibold">Sample Data (First 5)</h2>
			{#if debugInfo.sampleData.length === 0}
				<p>No posts found.</p>
			{:else}
				<ul class="list-disc pl-5">
					{#each debugInfo.sampleData as post}
						<li>
							<strong>{post.title}</strong><br />
							Slug: {post.slug}<br />
							Status: {post.status}
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</div>
</div>
