<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Card, CardContent, CardHeader } from '$lib/components/ui/card';
	import { ArrowLeft, Calendar, Clock, Eye, Twitter, Linkedin, Link } from '@lucide/svelte';

	export let data;
	const { post, relatedPosts } = data;

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function shareOnTwitter() {
		const text = `Check out this article: ${post.title}`;
		const url = window.location.href;
		window.open(
			`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
			'_blank'
		);
	}

	function shareOnLinkedIn() {
		const url = window.location.href;
		window.open(
			`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
			'_blank'
		);
	}

	function copyLink() {
		navigator.clipboard.writeText(window.location.href);
		// You could add a toast notification here
		alert('Link copied to clipboard!');
	}

	function getCategoryColor(category: string) {
		const colors: Record<string, string> = {
			tech: '#3B82F6',
			journey: '#10B981',
			travel: '#F59E0B',
			personal: '#8B5CF6',
			tutorial: '#EF4444',
			review: '#6B7280'
		};
		return colors[category] || '#6B7280';
	}

	function getCategoryName(category: string) {
		const names: Record<string, string> = {
			tech: 'Technology',
			journey: 'Career Journey',
			travel: 'Travel & Remote Work',
			personal: 'Personal Thoughts',
			tutorial: 'Tutorial',
			review: 'Review'
		};
		return names[category] || category;
	}
</script>

<svelte:head>
	<title>{post.title}</title>
	<meta name="description" content={post.meta_description || post.excerpt} />

	<!-- Open Graph -->
	<meta property="og:title" content={post.title} />
	<meta property="og:description" content={post.meta_description || post.excerpt} />
	<meta property="og:type" content="article" />
	<meta property="og:url" content={`${window?.location?.origin}/blog/${post.slug}`} />
	{#if post.featured_image}
		<meta property="og:image" content={post.featured_image} />
	{/if}

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={post.title} />
	<meta name="twitter:description" content={post.meta_description || post.excerpt} />
	{#if post.featured_image}
		<meta name="twitter:image" content={post.featured_image} />
	{/if}

	<!-- Article meta -->
	<meta property="article:author" content={post.author} />
	<meta property="article:published_time" content={post.published_at || post.created_at} />
	{#if post.tags}
		{#each post.tags as tag (tag)}
			<meta property="article:tag" content={tag} />
		{/each}
	{/if}
</svelte:head>

<main class="min-h-screen bg-gray-50">
	<!-- Header Navigation -->
	<div class="border-b border-gray-200 bg-white">
		<div class="container mx-auto px-4 py-6">
			<Button variant="ghost" onclick={() => history.back()}>
				<ArrowLeft size={16} class="mr-2" />
				Back to Blog
			</Button>
		</div>
	</div>

	<!-- Article Header -->
	<article class="bg-white">
		<div class="container mx-auto px-4 py-12">
			<div class="mx-auto max-w-4xl">
				<!-- Meta Information -->
				<div class="mb-6 flex flex-wrap items-center gap-4">
					<Badge
						variant="secondary"
						style="background-color: {getCategoryColor(post.category)}20; color: {getCategoryColor(
							post.category
						)}; border-color: {getCategoryColor(post.category)}40;"
					>
						{getCategoryName(post.category)}
					</Badge>

					<div class="flex items-center gap-4 text-sm text-gray-600">
						<div class="flex items-center gap-1">
							<Calendar size={14} />
							<span>{formatDate(post.published_at || post.created_at)}</span>
						</div>
						<div class="flex items-center gap-1">
							<Clock size={14} />
							<span>{post.reading_time} min read</span>
						</div>
						{#if post.views > 0}
							<div class="flex items-center gap-1">
								<Eye size={14} />
								<span>{post.views} views</span>
							</div>
						{/if}
					</div>
				</div>

				<!-- Title -->
				<h1 class="mb-6 text-4xl leading-tight font-bold text-gray-900 md:text-5xl">
					{post.title}
				</h1>

				<!-- Excerpt -->
				{#if post.excerpt}
					<p class="mb-8 text-xl leading-relaxed text-gray-600">
						{post.excerpt}
					</p>
				{/if}

				<!-- Author and Share -->
				<div class="mb-8 flex items-center justify-between border-b border-gray-200 pb-8">
					<div class="flex items-center gap-3">
						<div class="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
							<span class="font-semibold text-blue-600">{post.author.charAt(0)}</span>
						</div>
						<div>
							<div class="font-medium text-gray-900">{post.author}</div>
							<div class="text-sm text-gray-600">Author</div>
						</div>
					</div>

					<div class="flex items-center gap-2">
						<span class="mr-2 text-sm text-gray-600">Share:</span>
						<Button variant="outline" size="sm" onclick={shareOnTwitter}>
							<Twitter size={16} />
						</Button>
						<Button variant="outline" size="sm" onclick={shareOnLinkedIn}>
							<Linkedin size={16} />
						</Button>
						<Button variant="outline" size="sm" onclick={copyLink}>
							<Link size={16} />
						</Button>
					</div>
				</div>

				<!-- Featured Image -->
				{#if post.featured_image}
					<div class="mb-12">
						<img
							src={post.featured_image}
							alt={post.title}
							class="h-64 w-full rounded-lg object-cover shadow-lg md:h-96"
						/>
					</div>
				{/if}
			</div>
		</div>
	</article>

	<!-- Article Content -->
	<section class="py-8">
		<div class="container mx-auto px-4">
			<div class="mx-auto max-w-4xl">
				<div class="prose prose-lg max-w-none">
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html post.content}
				</div>
			</div>
		</div>
	</section>

	<!-- Tags -->
	{#if post.tags && post.tags.length > 0}
		<section class="border-t border-gray-200 py-8">
			<div class="container mx-auto px-4">
				<div class="mx-auto max-w-4xl">
					<h3 class="mb-4 text-lg font-semibold text-gray-900">Tags</h3>
					<div class="flex flex-wrap gap-2">
						{#each post.tags as tag (tag)}
							<Badge variant="outline" class="text-sm">
								#{tag}
							</Badge>
						{/each}
					</div>
				</div>
			</div>
		</section>
	{/if}

	<!-- Related Posts -->
	{#if relatedPosts.length > 0}
		<section class="border-t border-gray-200 bg-white py-12">
			<div class="container mx-auto px-4">
				<div class="mx-auto max-w-6xl">
					<h2 class="mb-8 text-2xl font-bold text-gray-900">Related Articles</h2>
					<div class="grid gap-6 md:grid-cols-3">
						{#each relatedPosts as relatedPost (relatedPost.slug)}
							<Card class="group transition-shadow duration-300 hover:shadow-lg">
								<a href="/blog/{relatedPost.slug}" class="block">
									{#if relatedPost.featured_image}
										<div class="aspect-video overflow-hidden rounded-t-lg">
											<img
												src={relatedPost.featured_image}
												alt={relatedPost.title}
												class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
											/>
										</div>
									{/if}

									<CardHeader class="pb-2">
										<h3
											class="line-clamp-2 font-semibold text-gray-900 transition-colors group-hover:text-blue-600"
										>
											{relatedPost.title}
										</h3>
									</CardHeader>

									<CardContent class="pt-0">
										{#if relatedPost.excerpt}
											<p class="mb-3 line-clamp-2 text-sm text-gray-600">{relatedPost.excerpt}</p>
										{/if}

										<div class="flex items-center gap-2 text-xs text-gray-500">
											<Clock size={12} />
											<span>{relatedPost.reading_time} min read</span>
											<span>•</span>
											<span>{formatDate(relatedPost.published_at || relatedPost.created_at)}</span>
										</div>
									</CardContent>
								</a>
							</Card>
						{/each}
					</div>
				</div>
			</div>
		</section>
	{/if}
</main>

<style>
	:global(.prose) {
		color: #374151;
		line-height: 1.75;
	}

	:global(.prose h1) {
		font-size: 2.25rem;
		font-weight: 700;
		color: #111827;
		margin-top: 2rem;
		margin-bottom: 1rem;
	}

	:global(.prose h2) {
		font-size: 1.875rem;
		font-weight: 600;
		color: #111827;
		margin-top: 2rem;
		margin-bottom: 1rem;
	}

	:global(.prose h3) {
		font-size: 1.5rem;
		font-weight: 600;
		color: #111827;
		margin-top: 1.5rem;
		margin-bottom: 0.75rem;
	}

	:global(.prose p) {
		margin-bottom: 1.5rem;
		line-height: 1.75;
	}

	:global(.prose ul, .prose ol) {
		margin-bottom: 1.5rem;
		padding-left: 1.5rem;
	}

	:global(.prose li) {
		margin-bottom: 0.5rem;
	}

	:global(.prose blockquote) {
		border-left: 4px solid #e5e7eb;
		padding-left: 1rem;
		font-style: italic;
		color: #6b7280;
		margin: 1.5rem 0;
	}

	:global(.prose code) {
		background-color: #f3f4f6;
		color: #1f2937;
		padding: 0.125rem 0.25rem;
		border-radius: 0.25rem;
		font-size: 0.875rem;
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
	}

	:global(.prose pre) {
		background-color: #1f2937;
		color: #f9fafb;
		padding: 1rem;
		border-radius: 0.5rem;
		overflow-x: auto;
		margin: 1.5rem 0;
	}

	:global(.prose pre code) {
		background-color: transparent;
		color: inherit;
		padding: 0;
	}

	:global(.prose a) {
		color: #3b82f6;
		text-decoration: underline;
	}

	:global(.prose a:hover) {
		color: #1d4ed8;
	}

	:global(.prose img) {
		border-radius: 0.5rem;
		margin: 1.5rem 0;
	}

	:global(.prose strong) {
		font-weight: 600;
		color: #111827;
	}

	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		line-clamp: 2;
	}
</style>
