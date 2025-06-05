<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardHeader, CardTitle, CardContent } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { content } from '$lib/stores/content';
	import type { Content } from '$lib/types/content';
	import {
		Mail,
		Github,
		Linkedin,
		Download,
		ArrowRight,
		ExternalLink,
		Code,
		Database,
		BarChart3,
		Brain,
		Star,
		Calendar,
		MapPin,
		Phone,
		Menu,
		X,
		ChevronUp
	} from '@lucide/svelte';

	let pageContent: Content | null = null;
	let animatedStats = { years: 0, projects: 0, clients: 0 };
	let isVisible = false;
	let mobileMenuOpen = false;
	let showScrollTop = false;
	let activeSection = 'hero';

	const unsubscribe = content.subscribe((value) => {
		pageContent = value;
		console.log('Landing page received content update:', value);
	});

	// Force refresh content when page becomes visible (e.g., returning from admin)
	function handleVisibilityChange() {
		if (!document.hidden) {
			console.log('Page visible again, refreshing content...');
			content.refresh();
		}
	}

	// Scroll tracking
	function handleScroll() {
		showScrollTop = window.scrollY > 300;

		// Update active section
		const sections = ['hero', 'about', 'services', 'projects', 'experience', 'contact'];
		for (const section of sections) {
			const element = document.getElementById(section);
			if (element) {
				const rect = element.getBoundingClientRect();
				if (rect.top <= 100 && rect.bottom >= 100) {
					activeSection = section;
					break;
				}
			}
		}
	}

	// Scroll to top
	function scrollToTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	onMount(() => {
		content.init();
		isVisible = true;

		// Listen for visibility changes to refresh content when returning from admin
		document.addEventListener('visibilitychange', handleVisibilityChange);

		// Also refresh on window focus
		window.addEventListener('focus', () => {
			console.log('Window focused, refreshing content...');
			content.refresh();
		});

		// Scroll listener
		window.addEventListener('scroll', handleScroll);

		const animateStats = () => {
			if (!pageContent?.stats) return;

			const duration = 2000;
			const steps = 60;
			const interval = duration / steps;

			const yearsIncrement = pageContent.stats.yearsExperience / steps;
			const projectsIncrement = pageContent.stats.projectsCompleted / steps;
			const clientsIncrement = pageContent.stats.satisfiedClients / steps;

			let currentStep = 0;

			const timer = setInterval(() => {
				if (currentStep < steps) {
					currentStep++;
					animatedStats = {
						years: Math.round(yearsIncrement * currentStep),
						projects: Math.round(projectsIncrement * currentStep),
						clients: Math.round(clientsIncrement * currentStep)
					};
				} else {
					clearInterval(timer);
					if (pageContent?.stats) {
						animatedStats = {
							years: pageContent.stats.yearsExperience,
							projects: pageContent.stats.projectsCompleted,
							clients: pageContent.stats.satisfiedClients
						};
					}
				}
			}, interval);
		};

		setTimeout(animateStats, 500);

		return () => {
			unsubscribe();
			document.removeEventListener('visibilitychange', handleVisibilityChange);
			window.removeEventListener('scroll', handleScroll);
		};
	});

	// Icon mapping for services
	const iconMap: Record<string, any> = {
		BarChart3,
		Brain,
		Database,
		Code,
		Star
	};

	function getIcon(iconName: string) {
		return iconMap[iconName] || Star;
	}

	function scrollToSection(sectionId: string) {
		mobileMenuOpen = false; // Close mobile menu
		const element = document.getElementById(sectionId);
		element?.scrollIntoView({ behavior: 'smooth' });
	}

	function openLink(url: string) {
		window.open(url, '_blank', 'noopener,noreferrer');
	}

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	// Handle contact form submission
	function handleContactForm(event: Event) {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);
		const name = formData.get('name');
		const email = formData.get('email');
		const message = formData.get('message');

		// Create mailto link
		const subject = `Portfolio Contact from ${name}`;
		const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
		const mailtoLink = `mailto:${pageContent?.contact?.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

		window.open(mailtoLink);
	}
</script>

<svelte:head>
	<title>Data Analyst Portfolio | Turning Data Into Insights</title>
	<meta
		name="description"
		content="Professional data analyst specializing in machine learning, business intelligence, and data visualization. Transforming complex data into actionable business insights."
	/>
</svelte:head>

{#if pageContent}
	<!-- Navigation -->
	<nav
		class="fixed top-0 z-50 w-full border-b border-gray-200 bg-white/90 backdrop-blur-md transition-all duration-300"
	>
		<div class="container mx-auto px-4 py-4">
			<div class="flex items-center justify-between">
				<div class="text-xl font-bold text-gray-900">Portfolio</div>

				<!-- Desktop Navigation -->
				<div class="hidden space-x-8 md:flex">
					<button
						onclick={() => scrollToSection('about')}
						class="text-gray-600 transition-colors hover:text-gray-900 {activeSection === 'about'
							? 'font-medium text-blue-600'
							: ''}"
					>
						About
					</button>
					<button
						onclick={() => scrollToSection('services')}
						class="text-gray-600 transition-colors hover:text-gray-900 {activeSection === 'services'
							? 'font-medium text-blue-600'
							: ''}"
					>
						Services
					</button>
					<button
						onclick={() => scrollToSection('projects')}
						class="text-gray-600 transition-colors hover:text-gray-900 {activeSection === 'projects'
							? 'font-medium text-blue-600'
							: ''}"
					>
						Projects
					</button>
					<button
						onclick={() => window.location.href = '/blog'}
						class="text-gray-600 transition-colors hover:text-gray-900"
					>
						Blog
					</button>
					<button
						onclick={() => scrollToSection('experience')}
						class="text-gray-600 transition-colors hover:text-gray-900 {activeSection ===
						'experience'
							? 'font-medium text-blue-600'
							: ''}"
					>
						Experience
					</button>
					<button
						onclick={() => scrollToSection('contact')}
						class="text-gray-600 transition-colors hover:text-gray-900 {activeSection === 'contact'
							? 'font-medium text-blue-600'
							: ''}"
					>
						Contact
					</button>
				</div>

				<div class="flex items-center gap-2">
					<Button variant="default" size="sm" class="hidden bg-blue-600 hover:bg-blue-700 sm:flex">
						<Download class="mr-2 h-4 w-4" />
						Resume
					</Button>

					<!-- Mobile menu button -->
					<button
						onclick={toggleMobileMenu}
						class="rounded-lg p-2 transition-colors hover:bg-gray-100 md:hidden"
						aria-label="Toggle mobile menu"
					>
						{#if mobileMenuOpen}
							<X class="h-6 w-6" />
						{:else}
							<Menu class="h-6 w-6" />
						{/if}
					</button>
				</div>
			</div>

			<!-- Mobile Navigation -->
			{#if mobileMenuOpen}
				<div class="animate-fade-in mt-4 border-t border-gray-200 pt-4 pb-4 md:hidden">
					<div class="space-y-3">
						<button
							onclick={() => scrollToSection('about')}
							class="block w-full py-2 text-left text-gray-600 transition-colors hover:text-gray-900 {activeSection ===
							'about'
								? 'font-medium text-blue-600'
								: ''}"
						>
							About
						</button>
						<button
							onclick={() => scrollToSection('services')}
							class="block w-full py-2 text-left text-gray-600 transition-colors hover:text-gray-900 {activeSection ===
							'services'
								? 'font-medium text-blue-600'
								: ''}"
						>
							Services
						</button>
						<button
							onclick={() => scrollToSection('projects')}
							class="block w-full py-2 text-left text-gray-600 transition-colors hover:text-gray-900 {activeSection ===
							'projects'
								? 'font-medium text-blue-600'
								: ''}"
						>
							Projects
						</button>
						<button
							onclick={() => window.location.href = '/blog'}
							class="block w-full py-2 text-left text-gray-600 transition-colors hover:text-gray-900"
						>
							Blog
						</button>
						<button
							onclick={() => scrollToSection('experience')}
							class="block w-full py-2 text-left text-gray-600 transition-colors hover:text-gray-900 {activeSection ===
							'experience'
								? 'font-medium text-blue-600'
								: ''}"
						>
							Experience
						</button>
						<button
							onclick={() => scrollToSection('contact')}
							class="block w-full py-2 text-left text-gray-600 transition-colors hover:text-gray-900 {activeSection ===
							'contact'
								? 'font-medium text-blue-600'
								: ''}"
						>
							Contact
						</button>
						<div class="pt-2">
							<Button variant="default" size="sm" class="w-full bg-blue-600 hover:bg-blue-700">
								<Download class="mr-2 h-4 w-4" />
								Download Resume
							</Button>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</nav>

	<!-- Hero Section -->
	<section
		id="hero"
		class="flex min-h-screen items-center bg-gradient-to-br from-slate-50 via-white to-blue-50 pt-24 pb-16"
	>
		<div class="container mx-auto px-4">
			<div class="grid items-center gap-12 lg:grid-cols-2">
				<div class="space-y-8" class:animate-fade-in={isVisible}>
					<div class="space-y-4">
						<div
							class="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
						>
							<Star class="mr-2 h-4 w-4" />
							Available for new projects
						</div>
						<h1 class="text-4xl leading-tight font-bold text-gray-900 md:text-6xl">
							{pageContent.hero.title}
						</h1>
						<h2 class="text-xl font-medium text-blue-600 md:text-2xl">
							{pageContent.hero.subtitle}
						</h2>
						<p class="max-w-lg text-lg leading-relaxed text-gray-600">
							{pageContent.hero.description}
						</p>
					</div>

					<div class="flex flex-col gap-4 sm:flex-row">
						<Button
							class="rounded-lg bg-blue-600 px-8 py-3 text-white hover:bg-blue-700"
							onclick={() => scrollToSection('contact')}
						>
							<Mail class="mr-2 h-4 w-4" />
							Get In Touch
						</Button>
						<Button
							variant="outline"
							class="rounded-lg px-8 py-3"
							onclick={() => scrollToSection('projects')}
						>
							View Projects
							<ArrowRight class="ml-2 h-4 w-4" />
						</Button>
					</div>

					<div class="flex space-x-6 pt-4">
						<button
							onclick={() => openLink(pageContent?.contact?.github || '')}
							class="text-gray-400 transition-colors hover:text-gray-600"
							aria-label="Visit GitHub profile"
						>
							<Github class="h-6 w-6" />
						</button>
						<button
							onclick={() => openLink(pageContent?.contact?.linkedin || '')}
							class="text-gray-400 transition-colors hover:text-gray-600"
							aria-label="Visit LinkedIn profile"
						>
							<Linkedin class="h-6 w-6" />
						</button>
						<button
							onclick={() => scrollToSection('contact')}
							class="text-gray-400 transition-colors hover:text-gray-600"
							aria-label="Go to contact section"
						>
							<Mail class="h-6 w-6" />
						</button>
					</div>
				</div>

				<div class="relative" class:animate-fade-in-delay={isVisible}>
					<div class="relative">
						<img
							src={pageContent.hero.profileImage}
							alt="Professional headshot"
							class="mx-auto h-80 w-80 rounded-2xl object-cover shadow-2xl"
							onerror={(e) => {
								const target = e.target as HTMLImageElement;
								target.src =
									'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face';
							}}
						/>
						<div class="absolute -right-6 -bottom-6 rounded-xl bg-white p-6 shadow-lg">
							<div class="text-center">
								<div class="text-2xl font-bold text-blue-600">{animatedStats.years}+</div>
								<div class="text-sm text-gray-600">Years Exp.</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Stats Section -->
	<section class="bg-white py-16">
		<div class="container mx-auto px-4">
			<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
				<div class="p-8 text-center">
					<div class="mb-2 text-4xl font-bold text-blue-600">{animatedStats.years}+</div>
					<div class="font-medium text-gray-600">Years Experience</div>
				</div>
				<div class="p-8 text-center">
					<div class="mb-2 text-4xl font-bold text-blue-600">{animatedStats.projects}+</div>
					<div class="font-medium text-gray-600">Projects Completed</div>
				</div>
				<div class="p-8 text-center">
					<div class="mb-2 text-4xl font-bold text-blue-600">{animatedStats.clients}+</div>
					<div class="font-medium text-gray-600">Satisfied Clients</div>
				</div>
			</div>
		</div>
	</section>

	<!-- About Section -->
	<section id="about" class="bg-gray-50 py-20">
		<div class="container mx-auto px-4">
			<div class="mx-auto max-w-3xl text-center">
				<h2 class="mb-6 text-3xl font-bold text-gray-900 md:text-4xl">About Me</h2>
				<p class="mb-8 text-lg leading-relaxed text-gray-600">
					{pageContent.about?.description || 'Loading...'}
				</p>
				<div class="grid gap-8 text-left md:grid-cols-2">
					<div>
						<h3 class="mb-3 font-semibold text-gray-900">Technical Expertise</h3>
						<ul class="space-y-2 text-gray-600">
							{#each pageContent.about?.technicalExpertise || [] as expertise}
								<li>• {expertise}</li>
							{/each}
						</ul>
					</div>
					<div>
						<h3 class="mb-3 font-semibold text-gray-900">Industry Focus</h3>
						<ul class="space-y-2 text-gray-600">
							{#each pageContent.about?.industryFocus || [] as industry}
								<li>• {industry}</li>
							{/each}
						</ul>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Services Section -->
	<section id="services" class="bg-white py-20">
		<div class="container mx-auto px-4">
			<div class="mb-16 text-center">
				<h2 class="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">Services</h2>
				<p class="mx-auto max-w-2xl text-lg text-gray-600">
					Comprehensive data solutions to help your business thrive in the data-driven economy
				</p>
			</div>

			<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
				{#each pageContent.services || [] as service}
					<Card
						class="border-0 bg-gradient-to-br from-white to-gray-50 p-6 transition-shadow duration-300 hover:shadow-lg"
					>
						<CardContent class="p-0">
							<div class="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
								<svelte:component this={getIcon(service.icon)} class="h-6 w-6 text-blue-600" />
							</div>
							<h3 class="mb-3 text-xl font-semibold text-gray-900">{service.title}</h3>
							<p class="leading-relaxed text-gray-600">{service.description}</p>
						</CardContent>
					</Card>
				{/each}
			</div>
		</div>
	</section>

	<!-- Projects Section -->
	<section id="projects" class="bg-gray-50 py-20">
		<div class="container mx-auto px-4">
			<div class="mb-16 text-center">
				<h2 class="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">Featured Projects</h2>
				<p class="mx-auto max-w-2xl text-lg text-gray-600">
					A showcase of recent projects demonstrating my expertise in data analysis and machine
					learning
				</p>
			</div>

			<div class="grid gap-8 lg:grid-cols-3">
				{#each pageContent.projects || [] as project}
					<Card class="overflow-hidden border-0 transition-all duration-300 hover:shadow-xl">
						<div
							class="relative aspect-video overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500"
						>
							<img src={project.image} alt={project.title} class="h-full w-full object-cover" />
							<div class="absolute inset-0 bg-black/20"></div>
						</div>
						<CardContent class="p-6">
							<h3 class="mb-3 text-xl font-semibold text-gray-900">{project.title}</h3>
							<p class="mb-4 leading-relaxed text-gray-600">{project.description}</p>

							<div class="mb-4 flex flex-wrap gap-2">
								{#each project.technologies || [] as tech}
									<Badge variant="secondary" class="text-xs">{tech}</Badge>
								{/each}
							</div>

							<div class="flex items-center justify-between">
								<div class="text-sm font-medium text-green-600">{project.impact}</div>
								<div class="flex items-center gap-2">
									<Button
										variant="outline"
										size="sm"
										onclick={() => {
											// Map project titles to their database slugs
											const projectSlugs: Record<string, string> = {
												'E-commerce Analytics Platform': 'ecommerce-analytics-platform',
												'Healthcare Data Dashboard': 'healthcare-data-dashboard',
												'Financial Portfolio Tracker': 'financial-portfolio-tracker',
												'Educational Content CMS': 'educational-content-cms'
											};
											const slug = projectSlugs[project.title] || project.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
											window.location.href = `/projects/${slug}`;
										}}
									>
										View Details
									</Button>
									<Button
										variant="ghost"
										size="sm"
										class="p-2"
										onclick={() => openLink(project.link)}
									>
										<ExternalLink class="h-4 w-4" />
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				{/each}
			</div>
		</div>
	</section>

	<!-- Skills Section -->
	<section class="bg-white py-20">
		<div class="container mx-auto px-4">
			<div class="mb-16 text-center">
				<h2 class="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">Technical Skills</h2>
				<p class="mx-auto max-w-2xl text-lg text-gray-600">
					Proficiency across the full data science stack
				</p>
			</div>

			<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
				{#each Object.entries(pageContent.skills || {}) as [category, skills]}
					<div class="space-y-6">
						<h3 class="text-lg font-semibold text-gray-900 capitalize">
							{category.replace(/([A-Z])/g, ' $1').trim()}
						</h3>
						<div class="space-y-4">
							{#each skills || [] as skill}
								<div class="space-y-2">
									<div class="flex items-center justify-between">
										<span class="text-sm font-medium text-gray-700">{skill.name}</span>
										<span class="text-xs text-gray-500">{skill.level}%</span>
									</div>
									<div class="h-2 w-full rounded-full bg-gray-200">
										<div
											class="h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-1000"
											style="width: {skill.level}%"
										></div>
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Experience Section -->
	<section id="experience" class="bg-gray-50 py-20">
		<div class="container mx-auto px-4">
			<div class="mb-16 text-center">
				<h2 class="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">Experience</h2>
				<p class="mx-auto max-w-2xl text-lg text-gray-600">
					Professional journey in data analytics and business intelligence
				</p>
			</div>

			<div class="mx-auto max-w-4xl">
				{#each pageContent.experience || [] as exp, index}
					<div
						class="relative pb-12 pl-8 {index === (pageContent.experience || []).length - 1
							? ''
							: 'border-l-2 border-gray-200'}"
					>
						<div class="absolute top-0 -left-2 h-4 w-4 rounded-full bg-blue-600"></div>
						<Card class="border-0 bg-white p-6 transition-shadow hover:shadow-md">
							<CardContent class="p-0">
								<div class="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
									<div>
										<h3 class="text-xl font-semibold text-gray-900">{exp.position}</h3>
										<div class="font-medium text-blue-600">{exp.company}</div>
									</div>
									<div class="flex items-center gap-2 text-sm text-gray-500">
										<Calendar class="h-4 w-4" />
										{exp.period}
									</div>
								</div>
								<div class="mb-4 flex items-center gap-2 text-sm text-gray-500">
									<MapPin class="h-4 w-4" />
									{exp.location}
								</div>
								<p class="mb-4 text-gray-600">{exp.description}</p>
								<ul class="space-y-2">
									{#each exp.achievements || [] as achievement}
										<li class="flex items-start gap-2 text-gray-600">
											<div class="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600"></div>
											{achievement}
										</li>
									{/each}
								</ul>
							</CardContent>
						</Card>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Contact Section -->
	<section id="contact" class="bg-white py-20">
		<div class="container mx-auto px-4">
			<div class="mx-auto max-w-4xl">
				<div class="mb-16 text-center">
					<h2 class="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">Let's Work Together</h2>
					<p class="mx-auto max-w-2xl text-lg text-gray-600">
						Ready to transform your data into actionable insights? Let's discuss how I can help your
						business grow.
					</p>
				</div>

				<div class="grid gap-12 md:grid-cols-2">
					<div class="space-y-8">
						<div>
							<h3 class="mb-6 text-xl font-semibold text-gray-900">Get in touch</h3>
							<div class="space-y-4">
								<button
									class="flex w-full items-center gap-3 text-left"
									onclick={() => openLink(`mailto:${pageContent?.contact?.email || ''}`)}
								>
									<Mail class="h-5 w-5 text-blue-600" />
									<span class="text-gray-600 transition-colors hover:text-blue-600"
										>{pageContent?.contact?.email || 'Loading...'}</span
									>
								</button>
								<button
									class="flex w-full items-center gap-3 text-left"
									onclick={() => openLink(`tel:${pageContent?.contact?.phone || ''}`)}
								>
									<Phone class="h-5 w-5 text-blue-600" />
									<span class="text-gray-600 transition-colors hover:text-blue-600"
										>{pageContent?.contact?.phone || 'Loading...'}</span
									>
								</button>
								<div class="flex items-center gap-3">
									<MapPin class="h-5 w-5 text-blue-600" />
									<span class="text-gray-600">{pageContent.contact?.location || 'Loading...'}</span>
								</div>
							</div>
						</div>

						<div class="flex space-x-4">
							<Button
								class="bg-blue-600 px-8 py-3 text-white hover:bg-blue-700"
								onclick={() => openLink(`mailto:${pageContent?.contact?.email || ''}`)}
							>
								<Mail class="mr-2 h-4 w-4" />
								Send Email
							</Button>
							<Button variant="outline" class="px-8 py-3">
								<Download class="mr-2 h-4 w-4" />
								Download CV
							</Button>
						</div>
					</div>

					<Card class="border-0 bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
						<CardContent class="p-0">
							<h3 class="mb-4 text-xl font-semibold text-gray-900">Quick Contact</h3>
							<form class="space-y-4" onsubmit={handleContactForm}>
								<div>
									<input
										type="text"
										placeholder="Your Name"
										name="name"
										class="w-full rounded-lg border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
									/>
								</div>
								<div>
									<input
										type="email"
										placeholder="Your Email"
										name="email"
										class="w-full rounded-lg border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
									/>
								</div>
								<div>
									<textarea
										placeholder="Your Message"
										rows="4"
										name="message"
										class="w-full rounded-lg border border-gray-200 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
									></textarea>
								</div>
								<Button type="submit" class="w-full bg-blue-600 py-3 text-white hover:bg-blue-700">
									Send Message
								</Button>
							</form>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	</section>

	<!-- Footer -->
	<footer class="bg-gray-900 py-12">
		<div class="container mx-auto px-4">
			<div class="text-center">
				<div class="mb-4 text-lg font-semibold text-white">Portfolio</div>
				<p class="mb-6 text-gray-400">Transforming data into insights, insights into action.</p>
				<div class="mb-8 flex justify-center space-x-6">
					<button
						onclick={() => openLink(pageContent?.contact?.github || '')}
						class="text-gray-400 transition-colors hover:text-white"
						aria-label="Visit GitHub profile"
					>
						<Github class="h-6 w-6" />
					</button>
					<button
						onclick={() => openLink(pageContent?.contact?.linkedin || '')}
						class="text-gray-400 transition-colors hover:text-white"
						aria-label="Visit LinkedIn profile"
					>
						<Linkedin class="h-6 w-6" />
					</button>
					<button
						onclick={() => scrollToSection('contact')}
						class="text-gray-400 transition-colors hover:text-white"
						aria-label="Go to contact section"
					>
						<Mail class="h-6 w-6" />
					</button>
				</div>
				<div class="mb-8 grid gap-6 text-sm md:grid-cols-4">
					<div>
						<h4 class="mb-2 font-medium text-white">Navigation</h4>
						<div class="space-y-1">
							<button
								onclick={() => scrollToSection('about')}
								class="block text-gray-400 transition-colors hover:text-white">About</button
							>
							<button
								onclick={() => scrollToSection('services')}
								class="block text-gray-400 transition-colors hover:text-white">Services</button
							>
							<button
								onclick={() => scrollToSection('projects')}
								class="block text-gray-400 transition-colors hover:text-white">Projects</button
							>
						</div>
					</div>
					<div>
						<h4 class="mb-2 font-medium text-white">Services</h4>
						<div class="space-y-1 text-gray-400">
							<div>Data Analytics</div>
							<div>Machine Learning</div>
							<div>Business Intelligence</div>
						</div>
					</div>
					<div>
						<h4 class="mb-2 font-medium text-white">Contact</h4>
						<div class="space-y-1 text-gray-400">
							<div>{pageContent.contact?.email}</div>
							<div>{pageContent.contact?.phone}</div>
							<div>{pageContent.contact?.location}</div>
						</div>
					</div>
					<div>
						<h4 class="mb-2 font-medium text-white">Resources</h4>
						<div class="space-y-1">
							<button class="block text-gray-400 transition-colors hover:text-white"
								>Download Resume</button
							>
							<button
								onclick={() => scrollToSection('contact')}
								class="block text-gray-400 transition-colors hover:text-white">Get Quote</button
							>
							<button
								onclick={() => scrollToTop()}
								class="block text-gray-400 transition-colors hover:text-white">Back to Top</button
							>
						</div>
					</div>
				</div>
				<div class="border-t border-gray-800 pt-6">
					<div class="text-sm text-gray-400">
						© 2024 Data Analyst Portfolio. All rights reserved. | Built with SvelteKit
					</div>
				</div>
			</div>
		</div>
	</footer>

	<!-- Scroll to Top Button -->
	{#if showScrollTop}
		<button
			onclick={scrollToTop}
			class="animate-fade-in fixed right-8 bottom-8 z-40 rounded-full bg-blue-600 p-3 text-white shadow-lg transition-all duration-300 hover:bg-blue-700"
			aria-label="Scroll to top"
		>
			<ChevronUp class="h-6 w-6" />
		</button>
	{/if}
{:else}
	<!-- Loading State -->
	<section
		class="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50"
	>
		<div class="text-center">
			<div
				class="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"
			></div>
			<h1 class="text-2xl font-semibold text-gray-900">Loading Portfolio</h1>
			<p class="mt-2 text-gray-600">Please wait while we prepare your experience...</p>
		</div>
	</section>
{/if}

<style>
	.animate-fade-in {
		animation: fadeIn 1s ease-out;
	}

	.animate-fade-in-delay {
		animation: fadeIn 1s ease-out 0.3s both;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Smooth scrolling */
	:global(html) {
		scroll-behavior: smooth;
	}

	/* Custom scrollbar */
	:global(::-webkit-scrollbar) {
		width: 8px;
	}

	:global(::-webkit-scrollbar-track) {
		background: #f1f1f1;
	}

	:global(::-webkit-scrollbar-thumb) {
		background: #c1c1c1;
		border-radius: 4px;
	}

	:global(::-webkit-scrollbar-thumb:hover) {
		background: #a8a8a8;
	}
</style>
