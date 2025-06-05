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
		error: null as any
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
	<div class="container mx-auto px-4 max-w-4xl">
		<h1 class="text-3xl font-bold text-gray-900 mb-8">Debug Information</h1>
		
		<!-- Environment Status -->
		<div class="bg-white rounded-lg shadow p-6 mb-6">
			<h2 class="text-xl font-semibold mb-4">Environment Variables</h2>
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
					<span class="text-gray-600 font-mono text-sm">{envStatus.keyPrefix}</span>
				</div>
				<div class="flex justify-between">
					<span class="font-medium">Timestamp:</span>
					<span class="text-gray-600 text-sm">{envStatus.timestamp}</span>
				</div>
			</div>
		</div>

		<!-- Connection Test -->
		<div class="bg-white rounded-lg shadow p-6 mb-6">
			<h2 class="text-xl font-semibold mb-4">Supabase Connection Test</h2>
			<div class="space-y-2">
				<div class="flex justify-between items-center">
					<span class="font-medium">Status:</span>
					<span class="px-3 py-1 rounded-full text-sm font-medium
						{connectionTest.status === 'success' ? 'bg-green-100 text-green-800' :
						  connectionTest.status === 'error' ? 'bg-red-100 text-red-800' :
						  connectionTest.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
						  'bg-blue-100 text-blue-800'}">
						{connectionTest.status}
					</span>
				</div>
				<div class="flex justify-between">
					<span class="font-medium">Message:</span>
					<span class="text-gray-600">{connectionTest.message}</span>
				</div>
				{#if connectionTest.error}
					<div class="mt-4 p-4 bg-red-50 border border-red-200 rounded">
						<h3 class="font-medium text-red-800 mb-2">Error Details:</h3>
						<pre class="text-sm text-red-700 whitespace-pre-wrap">{JSON.stringify(connectionTest.error, null, 2)}</pre>
					</div>
				{/if}
			</div>
		</div>

		<!-- Instructions -->
		<div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
			<h2 class="text-xl font-semibold mb-4 text-blue-800">How to Fix Deployment Issues</h2>
			<div class="space-y-4 text-blue-700">
				<p><strong>1. If you see "No Key" or connection fails:</strong></p>
				<ul class="list-disc list-inside ml-4 space-y-1">
					<li>Check your Cloudflare Pages environment variables</li>
					<li>Ensure variables are named: <code class="bg-blue-100 px-1 rounded">PUBLIC_SUPABASE_URL</code> and <code class="bg-blue-100 px-1 rounded">PUBLIC_SUPABASE_KEY</code></li>
					<li>Redeploy after adding environment variables</li>
				</ul>
				
				<p><strong>2. If environment looks good but connection fails:</strong></p>
				<ul class="list-disc list-inside ml-4 space-y-1">
					<li>Check Supabase dashboard for API health</li>
					<li>Verify RLS policies allow anonymous access</li>
					<li>Check database table exists</li>
				</ul>
			</div>
		</div>

		<div class="mt-8 text-center">
			<a href="/" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
				← Back to Portfolio
			</a>
		</div>
	</div>
</div> 