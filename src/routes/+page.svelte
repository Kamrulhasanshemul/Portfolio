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
