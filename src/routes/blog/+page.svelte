<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Card, CardContent, CardHeader } from '$lib/components/ui/card';
	import { Calendar, Clock, ArrowRight, Search, Filter } from '@lucide/svelte';

	export let data;
	const { posts, categories = [], totalCount, currentPage, totalPages, category } = data;

	let searchQuery = '';
	let selectedCategory = category;

	interface Category {
		slug: string;
		name: string;
		color: string;
	}

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function navigateToCategory(categorySlug: string) {
		const url = new URL($page.url);
		if (categorySlug) {
			url.searchParams.set('category', categorySlug);
		} else {
			url.searchParams.delete('category');
		}
		url.searchParams.delete('page');
		goto(url.toString());
	}

	function navigateToPage(pageNum: number) {
		const url = new URL($page.url);
		if (pageNum > 1) {
			url.searchParams.set('page', pageNum.toString());
		} else {
			url.searchParams.delete('page');
		}
		goto(url.toString());
	}

	function getCategoryColor(categorySlug: string) {
		const cat = categories.find((c: Category) => c.slug === categorySlug);
		return cat?.color || '#6B7280';
	}

	function getCategoryName(categorySlug: string) {
		const cat = categories.find((c: Category) => c.slug === categorySlug);
		return cat?.name || categorySlug;
	}

	// Calculate pagination range
	function getPaginationRange() {
		const range = [];
		const maxVisible = 5;

		let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
		let end = Math.min(totalPages, start + maxVisible - 1);

		if (end - start + 1 < maxVisible) {
			start = Math.max(1, end - maxVisible + 1);
		}

		for (let i = start; i <= end; i++) {
			range.push(i);
		}

		return range;
	}

	$: filteredPosts = posts.filter(
		(post) =>
			searchQuery === '' ||
			post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
	);
</script>

<svelte:head>
	<title>Blog - Latest Articles and Insights</title>
	<meta
		name="description"
		content="Read the latest articles about web development, data analytics, career insights, and technical tutorials."
	/>
</svelte:head>

<main class="min-h-screen bg-gray-50">
	<!-- Header -->
	<section class="border-b border-gray-200 bg-white">
		<div class="container mx-auto px-4 py-16">
			<div class="mx-auto max-w-4xl text-center">
				<h1 class="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">Blog</h1>
				<p class="mb-8 text-xl text-gray-600">
					Insights on development, data analytics, and the journey of building great software
				</p>

				<!-- Search -->
				<div class="mx-auto mb-8 max-w-md">
					<div class="relative">
						<Search
							size={20}
							class="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400"
						/>
						<input
							type="text"
							placeholder="Search articles..."
							bind:value={searchQuery}
							class="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
						/>
					</div>
				</div>

				<!-- Statistics -->
				<div class="flex justify-center gap-8 text-sm text-gray-600">
					<div>
						<span class="font-semibold text-gray-900">{totalCount}</span> articles
					</div>
					<div>
						<span class="font-semibold text-gray-900">{categories.length}</span> categories
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Filters -->
	<section class="border-b border-gray-200 bg-white">
		<div class="container mx-auto px-4 py-6">
			<div class="mx-auto max-w-6xl">
				<div class="flex items-center gap-4 overflow-x-auto pb-2">
					<div class="flex items-center gap-2 text-sm whitespace-nowrap text-gray-700">
						<Filter size={16} />
						<span>Filter by category:</span>
					</div>

					<Button
						variant={!selectedCategory ? 'default' : 'outline'}
						size="sm"
						onclick={() => navigateToCategory('')}
					>
						All
					</Button>

					{#each categories as cat (cat.slug)}
						<Button
							variant={selectedCategory === cat.slug ? 'default' : 'outline'}
							size="sm"
							onclick={() => navigateToCategory(cat.slug)}
							style="border-color: {cat.color}; {selectedCategory === cat.slug
								? `background-color: ${cat.color}; color: white;`
								: `color: ${cat.color};`}"
						>
							{cat.name}
						</Button>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<!-- Blog Posts -->
	<section class="py-12">
		<div class="container mx-auto px-4">
			<div class="mx-auto max-w-6xl">
				{#if filteredPosts.length === 0}
					<div class="py-12 text-center">
						<h3 class="mb-2 text-xl font-semibold text-gray-900">No articles found</h3>
						<p class="text-gray-600">
							{#if searchQuery}
								Try adjusting your search terms or browse all articles.
							{:else}
								Check back soon for new content!
							{/if}
						</p>
						{#if searchQuery}
							<Button onclick={() => (searchQuery = '')} class="mt-4">Clear search</Button>
						{/if}
					</div>
				{:else}
					<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
						{#each filteredPosts as post (post.slug)}
							<Card class="group cursor-pointer transition-shadow duration-300 hover:shadow-lg">
								<a href="/blog/{post.slug}" class="block">
									{#if post.featured_image}
										<div class="aspect-video overflow-hidden rounded-t-lg">
											<img
												src={post.featured_image}
												alt={post.title}
												class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
											/>
										</div>
									{/if}

									<CardHeader class="pb-3">
										<div class="mb-3 flex items-center gap-2">
											<Badge
												variant="secondary"
												style="background-color: {getCategoryColor(
													post.category
												)}20; color: {getCategoryColor(
													post.category
												)}; border-color: {getCategoryColor(post.category)}40;"
											>
												{getCategoryName(post.category)}
											</Badge>
											<div class="flex items-center gap-1 text-sm text-gray-500">
												<Clock size={14} />
												<span>{post.reading_time} min read</span>
											</div>
										</div>

										<h2
											class="line-clamp-2 text-xl font-semibold text-gray-900 transition-colors group-hover:text-blue-600"
										>
											{post.title}
										</h2>
									</CardHeader>

									<CardContent class="pt-0">
										<p class="mb-4 line-clamp-3 text-gray-600">{post.excerpt}</p>

										<div class="flex items-center justify-between">
											<div class="flex items-center gap-2 text-sm text-gray-500">
												<Calendar size={14} />
												<span>{formatDate(post.published_at || post.created_at)}</span>
											</div>

											<div
												class="flex items-center gap-1 text-sm font-medium text-blue-600 transition-all group-hover:gap-2"
											>
												<span>Read more</span>
												<ArrowRight size={14} />
											</div>
										</div>
									</CardContent>
								</a>
							</Card>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</section>

	<!-- Pagination -->
	{#if totalPages > 1 && filteredPosts.length > 0 && !searchQuery}
		<section class="border-t border-gray-200 py-8">
			<div class="container mx-auto px-4">
				<div class="mx-auto max-w-6xl">
					<div class="flex items-center justify-center gap-2">
						<!-- Previous Button -->
						<Button
							variant="outline"
							disabled={currentPage <= 1}
							onclick={() => navigateToPage(currentPage - 1)}
						>
							Previous
						</Button>

						<!-- Page Numbers -->
						{#each getPaginationRange() as pageNum (pageNum)}
							<Button
								variant={pageNum === currentPage ? 'default' : 'outline'}
								onclick={() => navigateToPage(pageNum)}
								class="min-w-[40px]"
							>
								{pageNum}
							</Button>
						{/each}

						<!-- Next Button -->
						<Button
							variant="outline"
							disabled={currentPage >= totalPages}
							onclick={() => navigateToPage(currentPage + 1)}
						>
							Next
						</Button>
					</div>

					<div class="mt-4 text-center text-sm text-gray-600">
						Showing {(currentPage - 1) * 6 + 1} to {Math.min(currentPage * 6, totalCount)} of {totalCount}
						articles
					</div>
				</div>
			</div>
		</section>
	{/if}
</main>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		line-clamp: 2;
	}

	.line-clamp-3 {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
		line-clamp: 3;
	}
</style>
