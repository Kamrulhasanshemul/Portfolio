<script>
	import { Button } from '$lib/components/ui/button';
</script>

<div class="container mx-auto px-4 py-8">
	<section class="mb-16">
		<h1 class="text-4xl font-bold mb-4">John Doe</h1>
		<p class="text-xl text-gray-600">Full Stack Developer</p>
		<p class="mt-4 max-w-2xl">Passionate developer with expertise in web technologies. I love creating elegant solutions to complex problems.</p>
	</section>

	<section class="mb-16">
		<h2 class="text-2xl font-semibold mb-6">Featured Projects</h2>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			<div class="bg-white p-6 rounded-lg shadow-md">
				<h3 class="text-xl font-semibold mb-2">Project One</h3>
				<p class="text-gray-600 mb-4">A full-stack web application built with SvelteKit and Tailwind CSS.</p>
				<Button variant="outline" class="w-full">View Project</Button>
			</div>
			<div class="bg-white p-6 rounded-lg shadow-md">
				<h3 class="text-xl font-semibold mb-2">Project Two</h3>
				<p class="text-gray-600 mb-4">Mobile-first e-commerce platform with real-time updates.</p>
				<Button variant="outline" class="w-full">View Project</Button>
			</div>
			<div class="bg-white p-6 rounded-lg shadow-md">
				<h3 class="text-xl font-semibold mb-2">Project Three</h3>
				<p class="text-gray-600 mb-4">AI-powered data visualization dashboard.</p>
				<Button variant="outline" class="w-full">View Project</Button>
			</div>
		</div>
	</section>

	<section class="mb-16">
		<h2 class="text-2xl font-semibold mb-6">Skills</h2>
		<div class="flex flex-wrap gap-3">
			<span class="px-4 py-2 bg-gray-100 rounded-full">JavaScript</span>
			<span class="px-4 py-2 bg-gray-100 rounded-full">TypeScript</span>
			<span class="px-4 py-2 bg-gray-100 rounded-full">React</span>
			<span class="px-4 py-2 bg-gray-100 rounded-full">Svelte</span>
			<span class="px-4 py-2 bg-gray-100 rounded-full">Node.js</span>
			<span class="px-4 py-2 bg-gray-100 rounded-full">Python</span>
		</div>
	</section>

	<section>
		<h2 class="text-2xl font-semibold mb-6">Contact</h2>
		<div class="flex gap-4">
			<Button variant="default">Email Me</Button>
			<Button variant="outline">Download CV</Button>
		</div>
	</section>
</div>
<script>
	import { onMount } from 'svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	let animatedCount = 0;
	let yearsExperience = 5;
	let projectsCompleted = 25;
	let satisfiedClients = 15;

	onMount(() => {
		// Animate count up effect
		const animateCount = () => {
			const duration = 2000;
			const steps = 60;
			const increment = yearsExperience / steps;
			let current = 0;
			
			const timer = setInterval(() => {
				if (current < yearsExperience) {
					current += increment;
					animatedCount = Math.round(current);
				} else {
					clearInterval(timer);
					animatedCount = yearsExperience;
				}
			}, duration / steps);
		};

		animateCount();
	});
</script>

<div class="min-h-screen bg-white">
	<!-- Hero Section -->
	<section class="relative py-20 bg-gradient-to-r from-blue-900 to-blue-800">
		<div class="container mx-auto px-4 flex flex-col md:flex-row items-center">
			<div class="md:w-1/2 mb-8 md:mb-0">
				<img src="/profile-photo.jpg" alt="Professional headshot" class="rounded-full w-48 h-48 object-cover mx-auto md:mx-0 shadow-lg" />
			</div>
			<div class="md:w-1/2 text-white">
				<h1 class="text-4xl md:text-5xl font-bold mb-4">Data Analyst</h1>
				<h2 class="text-2xl md:text-3xl text-blue-200 mb-6">Turning Numbers into Insights</h2>
				<p class="text-lg mb-8">Transforming complex data into actionable business insights through advanced analytics and visualization techniques.</p>
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
				<div class="p-6 bg-white rounded-lg shadow-md">
					<div class="text-4xl font-bold text-blue-900 mb-2">{animatedCount}+</div>
					<div class="text-gray-600">Years Experience</div>
				</div>
				<div class="p-6 bg-white rounded-lg shadow-md">
					<div class="text-4xl font-bold text-blue-900 mb-2">{projectsCompleted}+</div>
					<div class="text-gray-600">Projects Completed</div>
				</div>
				<div class="p-6 bg-white rounded-lg shadow-md">
					<div class="text-4xl font-bold text-blue-900 mb-2">{satisfiedClients}+</div>
					<div class="text-gray-600">Satisfied Clients</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Technical Skills -->
	<section class="py-16">
		<div class="container mx-auto px-4">
			<h2 class="text-3xl font-bold text-center mb-12">Technical Expertise</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
				<div class="p-6 bg-white rounded-lg shadow-md">
					<h3 class="text-xl font-semibold mb-4">Programming</h3>
					<div class="space-y-2">
						<div class="flex items-center gap-2">
							<span class="text-blue-900">Python</span>
							<div class="flex-1 bg-gray-200 rounded-full h-2">
								<div class="bg-blue-600 rounded-full h-2 w-[90%]"></div>
							</div>
						</div>
						<div class="flex items-center gap-2">
							<span class="text-blue-900">R</span>
							<div class="flex-1 bg-gray-200 rounded-full h-2">
								<div class="bg-blue-600 rounded-full h-2 w-[85%]"></div>
							</div>
						</div>
						<div class="flex items-center gap-2">
							<span class="text-blue-900">SQL</span>
							<div class="flex-1 bg-gray-200 rounded-full h-2">
								<div class="bg-blue-600 rounded-full h-2 w-[95%]"></div>
							</div>
						</div>
					</div>
				</div>
				
				<div class="p-6 bg-white rounded-lg shadow-md">
					<h3 class="text-xl font-semibold mb-4">Visualization</h3>
					<div class="space-y-2">
						<div class="flex items-center gap-2">
							<span class="text-blue-900">Tableau</span>
							<div class="flex-1 bg-gray-200 rounded-full h-2">
								<div class="bg-blue-600 rounded-full h-2 w-[92%]"></div>
							</div>
						</div>
						<div class="flex items-center gap-2">
							<span class="text-blue-900">Power BI</span>
							<div class="flex-1 bg-gray-200 rounded-full h-2">
								<div class="bg-blue-600 rounded-full h-2 w-[88%]"></div>
							</div>
						</div>
						<div class="flex items-center gap-2">
							<span class="text-blue-900">D3.js</span>
							<div class="flex-1 bg-gray-200 rounded-full h-2">
								<div class="bg-blue-600 rounded-full h-2 w-[80%]"></div>
							</div>
						</div>
					</div>
				</div>

				<div class="p-6 bg-white rounded-lg shadow-md">
					<h3 class="text-xl font-semibold mb-4">Databases</h3>
					<div class="space-y-2">
						<div class="flex items-center gap-2">
							<span class="text-blue-900">PostgreSQL</span>
							<div class="flex-1 bg-gray-200 rounded-full h-2">
								<div class="bg-blue-600 rounded-full h-2 w-[93%]"></div>
							</div>
						</div>
						<div class="flex items-center gap-2">
							<span class="text-blue-900">MongoDB</span>
							<div class="flex-1 bg-gray-200 rounded-full h-2">
								<div class="bg-blue-600 rounded-full h-2 w-[85%]"></div>
							</div>
						</div>
						<div class="flex items-center gap-2">
							<span class="text-blue-900">BigQuery</span>
							<div class="flex-1 bg-gray-200 rounded-full h-2">
								<div class="bg-blue-600 rounded-full h-2 w-[87%]"></div>
							</div>
						</div>
					</div>
				</div>

				<div class="p-6 bg-white rounded-lg shadow-md">
					<h3 class="text-xl font-semibold mb-4">Cloud & Tools</h3>
					<div class="space-y-2">
						<div class="flex items-center gap-2">
							<span class="text-blue-900">AWS</span>
							<div class="flex-1 bg-gray-200 rounded-full h-2">
								<div class="bg-blue-600 rounded-full h-2 w-[86%]"></div>
							</div>
						</div>
						<div class="flex items-center gap-2">
							<span class="text-blue-900">Docker</span>
							<div class="flex-1 bg-gray-200 rounded-full h-2">
								<div class="bg-blue-600 rounded-full h-2 w-[82%]"></div>
							</div>
						</div>
						<div class="flex items-center gap-2">
							<span class="text-blue-900">Git</span>
							<div class="flex-1 bg-gray-200 rounded-full h-2">
								<div class="bg-blue-600 rounded-full h-2 w-[90%]"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</div>
