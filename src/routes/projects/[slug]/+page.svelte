<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Card, CardContent } from '$lib/components/ui/card';
	import {
		ArrowLeft,
		ExternalLink,
		Github,
		Calendar,
		Users,
		Star,
		ChevronLeft,
		ChevronRight,
		X
	} from '@lucide/svelte';

	let { data } = $props();
	const { project } = $derived(data);

	let currentImageIndex = $state(0);
	let isImageModalOpen = $state(false);

	function openImageModal(index: number) {
		currentImageIndex = index;
		isImageModalOpen = true;
	}

	function closeImageModal() {
		isImageModalOpen = false;
	}

	function nextImage() {
		currentImageIndex = (currentImageIndex + 1) % project.images.length;
	}

	function prevImage() {
		currentImageIndex = (currentImageIndex - 1 + project.images.length) % project.images.length;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (isImageModalOpen) {
			if (event.key === 'Escape') closeImageModal();
			if (event.key === 'ArrowRight') nextImage();
			if (event.key === 'ArrowLeft') prevImage();
		}
	}

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long'
		});
	}

	function renderStars(rating: number) {
		return Array.from({ length: 5 }, (_, i) => i < rating);
	}
</script>

<svelte:head>
	<title>{project.title} - Project Details</title>
	<meta name="description" content={project.meta_description || project.short_description} />
	<meta name="keywords" content={project.meta_keywords?.join(', ') || ''} />

	<!-- Open Graph -->
	<meta property="og:title" content={project.title} />
	<meta property="og:description" content={project.meta_description || project.short_description} />
	<meta property="og:image" content={project.featured_image} />
	<meta property="og:type" content="article" />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={project.title} />
	<meta
		name="twitter:description"
		content={project.meta_description || project.short_description}
	/>
	<meta name="twitter:image" content={project.featured_image} />
</svelte:head>

<svelte:window onkeydown={handleKeydown} />

<main class="min-h-screen bg-gray-50">
	<!-- Header Navigation -->
	<div class="border-b border-gray-200 bg-white">
		<div class="container mx-auto px-4 py-6">
			<Button variant="ghost" onclick={() => history.back()} class="mb-4">
				<ArrowLeft size={16} class="mr-2" />
				Back to Portfolio
			</Button>
		</div>
	</div>

	<!-- Hero Section -->
	<section class="bg-white">
		<div class="container mx-auto px-4 py-12">
			<div class="mx-auto max-w-4xl">
				<!-- Project Header -->
				<div class="mb-8 text-center">
					<h1 class="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">{project.title}</h1>
					<p class="mb-6 text-xl text-gray-600">{project.short_description}</p>

					<!-- Meta Information -->
					<div class="mb-6 flex flex-wrap justify-center gap-6 text-sm text-gray-600">
						{#if project.project_date}
							<div class="flex items-center gap-2">
								<Calendar size={16} />
								<span>{formatDate(project.project_date)}</span>
							</div>
						{/if}
						{#if project.team_size}
							<div class="flex items-center gap-2">
								<Users size={16} />
								<span>{project.team_size} team members</span>
							</div>
						{/if}
						{#if project.project_duration}
							<div class="flex items-center gap-2">
								<Calendar size={16} />
								<span>{project.project_duration}</span>
							</div>
						{/if}
					</div>

					<!-- Action Buttons -->
					<div class="mb-8 flex flex-wrap justify-center gap-4">
						{#if project.live_demo_url}
							<Button onclick={() => window.open(project.live_demo_url, '_blank')}>
								<ExternalLink size={16} class="mr-2" />
								Live Demo
							</Button>
						{/if}
						{#if project.github_url}
							<Button variant="outline" onclick={() => window.open(project.github_url, '_blank')}>
								<Github size={16} class="mr-2" />
								View Code
							</Button>
						{/if}
					</div>
				</div>

				<!-- Featured Image -->
				{#if project.featured_image}
					<button
						class="relative mb-12 w-full cursor-pointer overflow-hidden rounded-lg border-0 bg-transparent p-0 shadow-lg"
						onclick={() => openImageModal(0)}
						aria-label="Open image in fullscreen"
					>
						<img
							src={project.featured_image}
							alt={project.title}
							class="h-64 w-full object-cover md:h-96"
						/>
					</button>
				{/if}
			</div>
		</div>
	</section>

	<!-- Content Section -->
	<section class="py-12">
		<div class="container mx-auto px-4">
			<div class="mx-auto max-w-4xl">
				<div class="grid gap-8 lg:grid-cols-3">
					<!-- Main Content -->
					<div class="space-y-8 lg:col-span-2">
						<!-- Project Description -->
						<Card>
							<CardContent class="p-8">
								<div class="prose prose-lg max-w-none">
									<!-- eslint-disable-next-line svelte/no-at-html-tags -->
									{@html project.full_description}
								</div>
							</CardContent>
						</Card>

						<!-- Key Features -->
						{#if project.key_features && project.key_features.length > 0}
							<Card>
								<CardContent class="p-8">
									<h2 class="mb-6 text-2xl font-bold text-gray-900">Key Features</h2>
									<div class="grid gap-6 md:grid-cols-2">
										{#each project.key_features as feature (feature.title)}
											<div class="space-y-2">
												<h3 class="font-semibold text-gray-900">{feature.title}</h3>
												<p class="text-gray-600">{feature.description}</p>
											</div>
										{/each}
									</div>
								</CardContent>
							</Card>
						{/if}

						<!-- Challenges and Solutions -->
						{#if project.challenges_solved && project.challenges_solved.length > 0}
							<Card>
								<CardContent class="p-8">
									<h2 class="mb-6 text-2xl font-bold text-gray-900">Challenges Solved</h2>
									<div class="space-y-6">
										{#each project.challenges_solved as challenge (challenge.challenge)}
											<div class="border-l-4 border-blue-500 pl-4">
												<h3 class="mb-2 font-semibold text-gray-900">{challenge.challenge}</h3>
												<p class="text-gray-600">{challenge.solution}</p>
											</div>
										{/each}
									</div>
								</CardContent>
							</Card>
						{/if}

						<!-- Results and Impact -->
						{#if project.results_achieved && project.results_achieved.length > 0}
							<Card>
								<CardContent class="p-8">
									<h2 class="mb-6 text-2xl font-bold text-gray-900">Results & Impact</h2>
									<div class="grid gap-6 md:grid-cols-2">
										{#each project.results_achieved as result (result.metric)}
											<div class="rounded-lg bg-blue-50 p-6 text-center">
												<div class="mb-2 text-3xl font-bold text-blue-600">{result.value}</div>
												<div class="mb-2 font-semibold text-gray-900">{result.metric}</div>
												<div class="text-sm text-gray-600">{result.description}</div>
											</div>
										{/each}
									</div>
								</CardContent>
							</Card>
						{/if}

						<!-- Image Gallery -->
						{#if project.images && project.images.length > 0}
							<Card>
								<CardContent class="p-8">
									<h2 class="mb-6 text-2xl font-bold text-gray-900">Project Gallery</h2>
									<div class="grid gap-4 md:grid-cols-2">
										{#each project.images as image, index (image.url || index)}
											<div class="space-y-2">
												<button
													class="w-full cursor-pointer border-0 bg-transparent p-0"
													onclick={() => openImageModal(index)}
													aria-label="Open image {index + 1} in fullscreen"
												>
													<img
														src={image.url}
														alt={image.alt}
														class="h-48 w-full rounded-lg object-cover transition-opacity hover:opacity-80"
													/>
												</button>
												{#if image.caption}
													<p class="text-sm text-gray-600">{image.caption}</p>
												{/if}
											</div>
										{/each}
									</div>
								</CardContent>
							</Card>
						{/if}

						<!-- Videos -->
						{#if project.videos && project.videos.length > 0}
							<Card>
								<CardContent class="p-8">
									<h2 class="mb-6 text-2xl font-bold text-gray-900">Project Videos</h2>
									<div class="space-y-6">
										{#each project.videos as video (video.url)}
											<div class="space-y-3">
												<h3 class="font-semibold text-gray-900">{video.title}</h3>
												{#if video.description}
													<p class="text-gray-600">{video.description}</p>
												{/if}
												<div class="aspect-video overflow-hidden rounded-lg">
													{#if video.type === 'youtube'}
														<iframe
															src={video.url}
															title={video.title}
															class="h-full w-full"
															frameborder="0"
															allowfullscreen
														></iframe>
													{:else}
														<video controls class="h-full w-full">
															<source src={video.url} type="video/mp4" />
															<track kind="captions" src="" label="Captions" default />
															Your browser does not support the video tag.
														</video>
													{/if}
												</div>
											</div>
										{/each}
									</div>
								</CardContent>
							</Card>
						{/if}
					</div>

					<!-- Sidebar -->
					<div class="space-y-6">
						<!-- Project Info -->
						<Card>
							<CardContent class="p-6">
								<h3 class="mb-4 font-semibold text-gray-900">Project Information</h3>
								<div class="space-y-3 text-sm">
									{#if project.client_name}
										<div>
											<span class="font-medium text-gray-700">Client:</span>
											<span class="text-gray-600">{project.client_name}</span>
										</div>
									{/if}
									{#if project.my_role}
										<div>
											<span class="font-medium text-gray-700">My Role:</span>
											<span class="text-gray-600">{project.my_role}</span>
										</div>
									{/if}
									<div>
										<span class="font-medium text-gray-700">Category:</span>
										<Badge variant="secondary" class="ml-2">{project.category}</Badge>
									</div>
								</div>
							</CardContent>
						</Card>

						<!-- Technologies -->
						{#if project.technologies && project.technologies.length > 0}
							<Card>
								<CardContent class="p-6">
									<h3 class="mb-4 font-semibold text-gray-900">Technologies Used</h3>
									<div class="flex flex-wrap gap-2">
										{#each project.technologies as tech (tech)}
											<Badge variant="outline">{tech}</Badge>
										{/each}
									</div>
								</CardContent>
							</Card>
						{/if}

						<!-- Testimonials -->
						{#if project.project_testimonials && project.project_testimonials.length > 0}
							<Card>
								<CardContent class="p-6">
									<h3 class="mb-4 font-semibold text-gray-900">Client Testimonials</h3>
									<div class="space-y-4">
										{#each project.project_testimonials as testimonial (testimonial.client_name)}
											<div class="space-y-3">
												<div class="flex">
													{#each renderStars(testimonial.rating) as filled, i (i)}
														<Star
															size={16}
															class={filled ? 'fill-current text-yellow-400' : 'text-gray-300'}
														/>
													{/each}
												</div>
												<blockquote class="text-gray-600 italic">
													"{testimonial.testimonial_text}"
												</blockquote>
												<div class="text-sm">
													<div class="font-medium text-gray-900">{testimonial.client_name}</div>
													{#if testimonial.client_title}
														<div class="text-gray-600">{testimonial.client_title}</div>
													{/if}
													{#if testimonial.client_company}
														<div class="text-gray-600">{testimonial.client_company}</div>
													{/if}
												</div>
											</div>
										{/each}
									</div>
								</CardContent>
							</Card>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</section>
</main>

<!-- Image Modal -->
{#if isImageModalOpen && project.images && project.images.length > 0}
	<div
		class="bg-opacity-90 fixed inset-0 z-50 flex items-center justify-center bg-black"
		onclick={closeImageModal}
		onkeydown={(e) => e.key === 'Escape' && closeImageModal()}
		role="dialog"
		aria-modal="true"
		aria-label="Image viewer"
		tabindex="-1"
	>
		<div
			class="relative max-h-full max-w-6xl p-4"
			onclick={(e) => e.stopPropagation()}
			role="presentation"
		>
			<img
				src={project.images[currentImageIndex].url}
				alt={project.images[currentImageIndex].alt}
				class="max-h-full max-w-full object-contain"
			/>

			{#if project.images.length > 1}
				<button
					onclick={prevImage}
					class="bg-opacity-50 hover:bg-opacity-70 absolute top-1/2 left-4 -translate-y-1/2 transform rounded-full bg-black p-2 text-white"
				>
					<ChevronLeft size={24} />
				</button>
				<button
					onclick={nextImage}
					class="bg-opacity-50 hover:bg-opacity-70 absolute top-1/2 right-4 -translate-y-1/2 transform rounded-full bg-black p-2 text-white"
				>
					<ChevronRight size={24} />
				</button>
			{/if}

			<button
				onclick={closeImageModal}
				class="bg-opacity-50 hover:bg-opacity-70 absolute top-4 right-4 rounded-full bg-black p-2 text-white"
			>
				<X size={24} />
			</button>

			{#if project.images[currentImageIndex].caption}
				<div class="bg-opacity-50 absolute right-4 bottom-4 left-4 rounded bg-black p-3 text-white">
					<p class="text-center">{project.images[currentImageIndex].caption}</p>
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	:global(.prose h1) {
		font-size: 1.875rem;
		font-weight: 700;
		color: #111827;
		margin-bottom: 1.5rem;
	}
	:global(.prose h2) {
		font-size: 1.5rem;
		font-weight: 600;
		color: #111827;
		margin-bottom: 1rem;
		margin-top: 2rem;
	}
	:global(.prose h3) {
		font-size: 1.25rem;
		font-weight: 600;
		color: #111827;
		margin-bottom: 0.75rem;
		margin-top: 1.5rem;
	}
	:global(.prose p) {
		color: #4b5563;
		margin-bottom: 1rem;
		line-height: 1.75;
	}
	:global(.prose ul) {
		list-style-type: disc;
		list-style-position: inside;
		color: #4b5563;
		margin-bottom: 1rem;
	}
	:global(.prose ol) {
		list-style-type: decimal;
		list-style-position: inside;
		color: #4b5563;
		margin-bottom: 1rem;
	}
	:global(.prose li) {
		margin-bottom: 0.25rem;
	}
	:global(.prose strong) {
		font-weight: 600;
		color: #111827;
	}
	:global(.prose code) {
		background-color: #f3f4f6;
		color: #1f2937;
		padding: 0.125rem 0.25rem;
		border-radius: 0.25rem;
		font-size: 0.875rem;
		font-family:
			ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace;
	}
	:global(.prose pre) {
		background-color: #1f2937;
		color: #f9fafb;
		padding: 1rem;
		border-radius: 0.5rem;
		overflow-x: auto;
		margin-bottom: 1rem;
	}
	:global(.prose blockquote) {
		border-left: 4px solid #e5e7eb;
		padding-left: 1rem;
		font-style: italic;
		color: #6b7280;
		margin-bottom: 1rem;
	}
</style>
