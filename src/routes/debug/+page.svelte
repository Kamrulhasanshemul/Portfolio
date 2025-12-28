<script lang="ts">
	import { ENV } from '$lib/env.js';
	import { onMount } from 'svelte';
	import { ContentService } from '$lib/supabase.js';

	let envStatus = {
		url: ENV.SUPABASE_URL,
		hasKey: !!ENV.SUPABASE_KEY,
		keyPrefix: ENV.SUPABASE_KEY ? ENV.SUPABASE_KEY.substring(0, 20) + '...' : 'NO KEY',
		timestamp: new Date().toISOString()
	};

	let connectionTest = {
		status: 'pending',
		message: '',
		error: null as unknown
	};

	onMount(async () => {
		// Test Supabase connection
		try {
			connectionTest.status = 'testing';
			const content = await ContentService.getContent();

			if (content) {
				connectionTest.status = 'success';
				connectionTest.message = `Connected! Found content with ${Object.keys(content).length} sections`;
			} else {
				connectionTest.status = 'warning';
				connectionTest.message = 'Connected but no content found';
			}
		} catch (err) {
			connectionTest.status = 'error';
			connectionTest.message = 'Connection failed';
			connectionTest.error = err;
		}
	});
</script>

<svelte:head>
	<title>Debug Info - Portfolio</title>
</svelte:head>

<div class="min-h-screen bg-gray-100 py-12">
	<div class="container mx-auto max-w-4xl px-4">
		<h1 class="mb-8 text-3xl font-bold text-gray-900">Debug Information</h1>

		<!-- Environment Status -->
		<div class="mb-6 rounded-lg bg-white p-6 shadow">
			<h2 class="mb-4 text-xl font-semibold">Environment Variables</h2>
			<div class="space-y-2">
				<div class="flex justify-between">
					<span class="font-medium">Supabase URL:</span>
					<span class="text-green-600">{envStatus.url}</span>
				</div>
				<div class="flex justify-between">
					<span class="font-medium">Has API Key:</span>
					<span class={envStatus.hasKey ? 'text-green-600' : 'text-red-600'}>
						{envStatus.hasKey ? 'Yes' : 'No'}
					</span>
				</div>
				<div class="flex justify-between">
					<span class="font-medium">Key Preview:</span>
					<span class="font-mono text-sm text-gray-600">{envStatus.keyPrefix}</span>
				</div>
				<div class="flex justify-between">
					<span class="font-medium">Timestamp:</span>
					<span class="text-sm text-gray-600">{envStatus.timestamp}</span>
				</div>
			</div>
		</div>

		<!-- Connection Test -->
		<div class="mb-6 rounded-lg bg-white p-6 shadow">
			<h2 class="mb-4 text-xl font-semibold">Supabase Connection Test</h2>
			<div class="space-y-2">
				<div class="flex items-center justify-between">
					<span class="font-medium">Status:</span>
					<span
						class="rounded-full px-3 py-1 text-sm font-medium
						{connectionTest.status === 'success'
							? 'bg-green-100 text-green-800'
							: connectionTest.status === 'error'
								? 'bg-red-100 text-red-800'
								: connectionTest.status === 'warning'
									? 'bg-yellow-100 text-yellow-800'
									: 'bg-blue-100 text-blue-800'}"
					>
						{connectionTest.status}
					</span>
				</div>
				<div class="flex justify-between">
					<span class="font-medium">Message:</span>
					<span class="text-gray-600">{connectionTest.message}</span>
				</div>
				{#if connectionTest.error}
					<div class="mt-4 rounded border border-red-200 bg-red-50 p-4">
						<h3 class="mb-2 font-medium text-red-800">Error Details:</h3>
						<pre class="text-sm whitespace-pre-wrap text-red-700">{JSON.stringify(
								connectionTest.error,
								null,
								2
							)}</pre>
					</div>
				{/if}
			</div>
		</div>

		<!-- Instructions -->
		<div class="rounded-lg border border-blue-200 bg-blue-50 p-6">
			<h2 class="mb-4 text-xl font-semibold text-blue-800">How to Fix Deployment Issues</h2>
			<div class="space-y-4 text-blue-700">
				<p><strong>1. If you see "No Key" or connection fails:</strong></p>
				<ul class="ml-4 list-inside list-disc space-y-1">
					<li>Check your Cloudflare Pages environment variables</li>
					<li>
						Ensure variables are named: <code class="rounded bg-blue-100 px-1"
							>PUBLIC_SUPABASE_URL</code
						>
						and <code class="rounded bg-blue-100 px-1">PUBLIC_SUPABASE_KEY</code>
					</li>
					<li>Redeploy after adding environment variables</li>
				</ul>

				<p><strong>2. If environment looks good but connection fails:</strong></p>
				<ul class="ml-4 list-inside list-disc space-y-1">
					<li>Check Supabase dashboard for API health</li>
					<li>Verify RLS policies allow anonymous access</li>
					<li>Check database table exists</li>
				</ul>
			</div>
		</div>

		<div class="mt-8 text-center">
			<a
				href="/"
				class="rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
			>
				← Back to Portfolio
			</a>
		</div>
	</div>
</div>
