<script>
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardHeader, CardTitle, CardContent } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { content } from '$lib/stores/content';

	let pageContent;
	const unsubscribe = content.subscribe(value => {
		pageContent = value;
	});

	let animatedCount = 0;

	onMount(() => {
		const animateCount = () => {
			const duration = 2000;
			const steps = 60;
			const increment = pageContent.stats.yearsExperience / steps;
			let current = 0;

			const timer = setInterval(() => {
				if (current < pageContent.stats.yearsExperience) {
					current += increment;
					animatedCount = Math.round(current);
				} else {
					clearInterval(timer);
					animatedCount = pageContent.stats.yearsExperience;
				}
			}, duration / steps);
		};

		animateCount();
		return () => unsubscribe();
	});
</script>

<!-- Hero Section -->
<section class="relative py-20 bg-gradient-to-r from-blue-900 to-blue-800">
	<div class="container mx-auto px-4 flex flex-col md:flex-row items-center">
		<div class="md:w-1/2 mb-8 md:mb-0 flex justify-center">
			<img src={pageContent.hero.profileImage} alt="Professional headshot" class="rounded-full w-48 h-48 object-cover shadow-lg" />
		</div>
		<div class="md:w-1/2 text-white">
			<h1 class="text-4xl md:text-5xl font-bold mb-4">{pageContent.hero.title}</h1>
			<h2 class="text-2xl md:text-3xl text-blue-200 mb-6">{pageContent.hero.subtitle}</h2>
			<p class="text-lg mb-8">{pageContent.hero.description}</p>
			<div class="flex gap-4">
				<Button variant="default" class="bg-blue-500 hover:bg-blue-600">View Projects</Button>
				<Button variant="outline" class="border-white text-white hover:bg-white hover:text-blue-900">Download Resume</Button>
			</div>
		</div>
	</div>
</section>

<!-- Stats Section -->
<section class="py-16 bg-gray-50">
	<div class="container mx-auto px-4">
		<div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
			<Card>
				<CardHeader>
					<CardTitle class="text-4xl font-bold text-blue-900">{animatedCount}+</CardTitle>
				</CardHeader>
				<CardContent>
					<div class="text-gray-600">Years Experience</div>
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle class="text-4xl font-bold text-blue-900">{pageContent.stats.projectsCompleted}+</CardTitle>
				</CardHeader>
				<CardContent>
					<div class="text-gray-600">Projects Completed</div>
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle class="text-4xl font-bold text-blue-900">{pageContent.stats.satisfiedClients}+</CardTitle>
				</CardHeader>
				<CardContent>
					<div class="text-gray-600">Satisfied Clients</div>
				</CardContent>
			</Card>
		</div>
	</div>
</section>

<!-- Featured Projects -->
<section class="py-16">
	<div class="container mx-auto px-4">
		<h2 class="text-3xl font-bold text-center mb-12">Featured Projects</h2>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each pageContent.projects as project}
				<Card>
					<CardHeader>
						<CardTitle class="text-xl font-semibold mb-2">{project.title}</CardTitle>
					</CardHeader>
					<CardContent>
						<p class="text-gray-600 mb-4">{project.description}</p>
						<Button variant="outline" class="w-full">View Project</Button>
					</CardContent>
				</Card>
			{/each}
		</div>
	</div>
</section>

<!-- Technical Skills -->
<section class="py-16">
	<div class="container mx-auto px-4">
		<h2 class="text-3xl font-bold text-center mb-12">Technical Expertise</h2>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
			{#each Object.entries(pageContent.skills) as [category, skills]}
				<Card>
					<CardHeader>
						<CardTitle class="text-xl font-semibold capitalize">{category.replace(/([A-Z])/g, ' $1').trim()}</CardTitle>
					</CardHeader>
					<CardContent>
						<div class="space-y-2">
							{#each skills as skill}
								<div class="flex items-center gap-2">
									<span class="text-blue-900">{skill.name}</span>
									<div class="flex-1 bg-gray-200 rounded-full h-2">
										<div class="bg-blue-600 rounded-full h-2" style="width: {skill.level}%"></div>
									</div>
								</div>
							{/each}
						</div>
					</CardContent>
				</Card>
			{/each}
		</div>
	</div>
</section>

<!-- Contact Section -->
<section class="py-16">
	<div class="container mx-auto px-4">
		<h2 class="text-3xl font-bold text-center mb-8">Contact</h2>
		<div class="flex justify-center gap-4">
			<Button variant="default">Email Me</Button>
			<Button variant="outline">Download CV</Button>
		</div>
	</div>
</section>
