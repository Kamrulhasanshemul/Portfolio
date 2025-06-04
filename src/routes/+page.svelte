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

	const unsubscribe = content.subscribe(value => {
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
					animatedStats = {
						years: pageContent.stats.yearsExperience,
						projects: pageContent.stats.projectsCompleted,
						clients: pageContent.stats.satisfiedClients
					};
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
	const iconMap = {
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
	<meta name="description" content="Professional data analyst specializing in machine learning, business intelligence, and data visualization. Transforming complex data into actionable business insights." />
</svelte:head>

{#if pageContent}
<!-- Navigation -->
<nav class="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-200 z-50 transition-all duration-300">
	<div class="container mx-auto px-4 py-4">
		<div class="flex justify-between items-center">
			<div class="font-bold text-xl text-gray-900">Portfolio</div>
			
			<!-- Desktop Navigation -->
			<div class="hidden md:flex space-x-8">
				<button 
					on:click={() => scrollToSection('about')} 
					class="text-gray-600 hover:text-gray-900 transition-colors {activeSection === 'about' ? 'text-blue-600 font-medium' : ''}"
				>
					About
				</button>
				<button 
					on:click={() => scrollToSection('services')} 
					class="text-gray-600 hover:text-gray-900 transition-colors {activeSection === 'services' ? 'text-blue-600 font-medium' : ''}"
				>
					Services
				</button>
				<button 
					on:click={() => scrollToSection('projects')} 
					class="text-gray-600 hover:text-gray-900 transition-colors {activeSection === 'projects' ? 'text-blue-600 font-medium' : ''}"
				>
					Projects
				</button>
				<button 
					on:click={() => scrollToSection('experience')} 
					class="text-gray-600 hover:text-gray-900 transition-colors {activeSection === 'experience' ? 'text-blue-600 font-medium' : ''}"
				>
					Experience
				</button>
				<button 
					on:click={() => scrollToSection('contact')} 
					class="text-gray-600 hover:text-gray-900 transition-colors {activeSection === 'contact' ? 'text-blue-600 font-medium' : ''}"
				>
					Contact
				</button>
			</div>
			
			<div class="flex items-center gap-2">
				<Button variant="default" size="sm" class="bg-blue-600 hover:bg-blue-700 hidden sm:flex">
					<Download class="w-4 h-4 mr-2" />
					Resume
				</Button>
				
				<!-- Mobile menu button -->
				<button 
					on:click={toggleMobileMenu}
					class="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
					aria-label="Toggle mobile menu"
				>
					{#if mobileMenuOpen}
						<X class="w-6 h-6" />
					{:else}
						<Menu class="w-6 h-6" />
					{/if}
				</button>
			</div>
		</div>
		
		<!-- Mobile Navigation -->
		{#if mobileMenuOpen}
			<div class="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4 animate-fade-in">
				<div class="space-y-3">
					<button 
						on:click={() => scrollToSection('about')} 
						class="block w-full text-left py-2 text-gray-600 hover:text-gray-900 transition-colors {activeSection === 'about' ? 'text-blue-600 font-medium' : ''}"
					>
						About
					</button>
					<button 
						on:click={() => scrollToSection('services')} 
						class="block w-full text-left py-2 text-gray-600 hover:text-gray-900 transition-colors {activeSection === 'services' ? 'text-blue-600 font-medium' : ''}"
					>
						Services
					</button>
					<button 
						on:click={() => scrollToSection('projects')} 
						class="block w-full text-left py-2 text-gray-600 hover:text-gray-900 transition-colors {activeSection === 'projects' ? 'text-blue-600 font-medium' : ''}"
					>
						Projects
					</button>
					<button 
						on:click={() => scrollToSection('experience')} 
						class="block w-full text-left py-2 text-gray-600 hover:text-gray-900 transition-colors {activeSection === 'experience' ? 'text-blue-600 font-medium' : ''}"
					>
						Experience
					</button>
					<button 
						on:click={() => scrollToSection('contact')} 
						class="block w-full text-left py-2 text-gray-600 hover:text-gray-900 transition-colors {activeSection === 'contact' ? 'text-blue-600 font-medium' : ''}"
					>
						Contact
					</button>
					<div class="pt-2">
						<Button variant="default" size="sm" class="bg-blue-600 hover:bg-blue-700 w-full">
							<Download class="w-4 h-4 mr-2" />
							Download Resume
						</Button>
					</div>
				</div>
			</div>
		{/if}
	</div>
</nav>

<!-- Hero Section -->
<section id="hero" class="pt-24 pb-16 min-h-screen flex items-center bg-gradient-to-br from-slate-50 via-white to-blue-50">
	<div class="container mx-auto px-4">
		<div class="grid lg:grid-cols-2 gap-12 items-center">
			<div class="space-y-8" class:animate-fade-in={isVisible}>
				<div class="space-y-4">
					<div class="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
						<Star class="w-4 h-4 mr-2" />
						Available for new projects
					</div>
					<h1 class="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
						{pageContent.hero.title}
					</h1>
					<h2 class="text-xl md:text-2xl text-blue-600 font-medium">
						{pageContent.hero.subtitle}
					</h2>
					<p class="text-lg text-gray-600 leading-relaxed max-w-lg">
						{pageContent.hero.description}
					</p>
				</div>
				
				<div class="flex flex-col sm:flex-row gap-4">
					<Button class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg" on:click={() => scrollToSection('contact')}>
						<Mail class="w-4 h-4 mr-2" />
						Get In Touch
					</Button>
					<Button variant="outline" class="px-8 py-3 rounded-lg" on:click={() => scrollToSection('projects')}>
						View Projects
						<ArrowRight class="w-4 h-4 ml-2" />
					</Button>
				</div>

				<div class="flex space-x-6 pt-4">
					<button 
						on:click={() => openLink(pageContent.contact?.github || '')} 
						class="text-gray-400 hover:text-gray-600 transition-colors"
						aria-label="Visit GitHub profile"
					>
						<Github class="w-6 h-6" />
					</button>
					<button 
						on:click={() => openLink(pageContent.contact?.linkedin || '')} 
						class="text-gray-400 hover:text-gray-600 transition-colors"
						aria-label="Visit LinkedIn profile"
					>
						<Linkedin class="w-6 h-6" />
					</button>
					<button 
						on:click={() => scrollToSection('contact')} 
						class="text-gray-400 hover:text-gray-600 transition-colors"
						aria-label="Go to contact section"
					>
						<Mail class="w-6 h-6" />
					</button>
				</div>
			</div>

			<div class="relative" class:animate-fade-in-delay={isVisible}>
				<div class="relative">
					<img 
						src={pageContent.hero.profileImage} 
						alt="Professional headshot" 
						class="w-80 h-80 rounded-2xl object-cover shadow-2xl mx-auto"
						on:error={(e) => e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'}
					/>
					<div class="absolute -bottom-6 -right-6 bg-white rounded-xl p-6 shadow-lg">
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
<section class="py-16 bg-white">
	<div class="container mx-auto px-4">
		<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
			<div class="text-center p-8">
				<div class="text-4xl font-bold text-blue-600 mb-2">{animatedStats.years}+</div>
				<div class="text-gray-600 font-medium">Years Experience</div>
			</div>
			<div class="text-center p-8">
				<div class="text-4xl font-bold text-blue-600 mb-2">{animatedStats.projects}+</div>
				<div class="text-gray-600 font-medium">Projects Completed</div>
			</div>
			<div class="text-center p-8">
				<div class="text-4xl font-bold text-blue-600 mb-2">{animatedStats.clients}+</div>
				<div class="text-gray-600 font-medium">Satisfied Clients</div>
			</div>
		</div>
	</div>
</section>

<!-- About Section -->
<section id="about" class="py-20 bg-gray-50">
	<div class="container mx-auto px-4">
		<div class="max-w-3xl mx-auto text-center">
			<h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">About Me</h2>
			<p class="text-lg text-gray-600 leading-relaxed mb-8">
				{pageContent.about?.description || "Loading..."}
			</p>
			<div class="grid md:grid-cols-2 gap-8 text-left">
				<div>
					<h3 class="font-semibold text-gray-900 mb-3">Technical Expertise</h3>
					<ul class="space-y-2 text-gray-600">
						{#each pageContent.about?.technicalExpertise || [] as expertise}
							<li>• {expertise}</li>
						{/each}
					</ul>
				</div>
				<div>
					<h3 class="font-semibold text-gray-900 mb-3">Industry Focus</h3>
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
<section id="services" class="py-20 bg-white">
	<div class="container mx-auto px-4">
		<div class="text-center mb-16">
			<h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Services</h2>
			<p class="text-lg text-gray-600 max-w-2xl mx-auto">
				Comprehensive data solutions to help your business thrive in the data-driven economy
			</p>
		</div>

		<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
			{#each pageContent.services || [] as service}
				<Card class="p-6 hover:shadow-lg transition-shadow duration-300 border-0 bg-gradient-to-br from-white to-gray-50">
					<CardContent class="p-0">
						<div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
							<svelte:component this={getIcon(service.icon)} class="w-6 h-6 text-blue-600" />
						</div>
						<h3 class="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
						<p class="text-gray-600 leading-relaxed">{service.description}</p>
					</CardContent>
				</Card>
			{/each}
		</div>
	</div>
</section>

<!-- Projects Section -->
<section id="projects" class="py-20 bg-gray-50">
	<div class="container mx-auto px-4">
		<div class="text-center mb-16">
			<h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Projects</h2>
			<p class="text-lg text-gray-600 max-w-2xl mx-auto">
				A showcase of recent projects demonstrating my expertise in data analysis and machine learning
			</p>
		</div>

		<div class="grid lg:grid-cols-3 gap-8">
			{#each pageContent.projects || [] as project}
				<Card class="overflow-hidden hover:shadow-xl transition-all duration-300 border-0">
					<div class="aspect-video bg-gradient-to-br from-blue-400 to-purple-500 relative overflow-hidden">
						<img src={project.image} alt={project.title} class="w-full h-full object-cover" />
						<div class="absolute inset-0 bg-black/20"></div>
					</div>
					<CardContent class="p-6">
						<h3 class="text-xl font-semibold text-gray-900 mb-3">{project.title}</h3>
						<p class="text-gray-600 mb-4 leading-relaxed">{project.description}</p>
						
						<div class="flex flex-wrap gap-2 mb-4">
							{#each project.technologies || [] as tech}
								<Badge variant="secondary" class="text-xs">{tech}</Badge>
							{/each}
						</div>
						
						<div class="flex items-center justify-between">
							<div class="text-sm font-medium text-green-600">{project.impact}</div>
							<Button variant="ghost" size="sm" class="p-2" on:click={() => openLink(project.link)}>
								<ExternalLink class="w-4 h-4" />
							</Button>
						</div>
					</CardContent>
				</Card>
			{/each}
		</div>
	</div>
</section>

<!-- Skills Section -->
<section class="py-20 bg-white">
	<div class="container mx-auto px-4">
		<div class="text-center mb-16">
			<h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Technical Skills</h2>
			<p class="text-lg text-gray-600 max-w-2xl mx-auto">
				Proficiency across the full data science stack
			</p>
		</div>

		<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
			{#each Object.entries(pageContent.skills || {}) as [category, skills]}
				<div class="space-y-6">
					<h3 class="text-lg font-semibold text-gray-900 capitalize">
						{category.replace(/([A-Z])/g, ' $1').trim()}
					</h3>
					<div class="space-y-4">
						{#each skills || [] as skill}
							<div class="space-y-2">
								<div class="flex justify-between items-center">
									<span class="text-sm font-medium text-gray-700">{skill.name}</span>
									<span class="text-xs text-gray-500">{skill.level}%</span>
								</div>
								<div class="w-full bg-gray-200 rounded-full h-2">
									<div 
										class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-full h-2 transition-all duration-1000" 
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
<section id="experience" class="py-20 bg-gray-50">
	<div class="container mx-auto px-4">
		<div class="text-center mb-16">
			<h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Experience</h2>
			<p class="text-lg text-gray-600 max-w-2xl mx-auto">
				Professional journey in data analytics and business intelligence
			</p>
		</div>

		<div class="max-w-4xl mx-auto">
			{#each pageContent.experience || [] as exp, index}
				<div class="relative pl-8 pb-12 {index === (pageContent.experience || []).length - 1 ? '' : 'border-l-2 border-gray-200'}">
					<div class="absolute -left-2 top-0 w-4 h-4 bg-blue-600 rounded-full"></div>
					<Card class="p-6 hover:shadow-md transition-shadow border-0 bg-white">
						<CardContent class="p-0">
							<div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
								<div>
									<h3 class="text-xl font-semibold text-gray-900">{exp.position}</h3>
									<div class="text-blue-600 font-medium">{exp.company}</div>
								</div>
								<div class="text-sm text-gray-500 flex items-center gap-2">
									<Calendar class="w-4 h-4" />
									{exp.period}
								</div>
							</div>
							<div class="flex items-center gap-2 text-sm text-gray-500 mb-4">
								<MapPin class="w-4 h-4" />
								{exp.location}
							</div>
							<p class="text-gray-600 mb-4">{exp.description}</p>
							<ul class="space-y-2">
								{#each exp.achievements || [] as achievement}
									<li class="text-gray-600 flex items-start gap-2">
										<div class="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
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
<section id="contact" class="py-20 bg-white">
	<div class="container mx-auto px-4">
		<div class="max-w-4xl mx-auto">
			<div class="text-center mb-16">
				<h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Let's Work Together</h2>
				<p class="text-lg text-gray-600 max-w-2xl mx-auto">
					Ready to transform your data into actionable insights? Let's discuss how I can help your business grow.
				</p>
			</div>

			<div class="grid md:grid-cols-2 gap-12">
				<div class="space-y-8">
					<div>
						<h3 class="text-xl font-semibold text-gray-900 mb-6">Get in touch</h3>
						<div class="space-y-4">
							<button class="flex items-center gap-3 text-left w-full" on:click={() => openLink(`mailto:${pageContent.contact?.email || ''}`)}>
								<Mail class="w-5 h-5 text-blue-600" />
								<span class="text-gray-600 hover:text-blue-600 transition-colors">{pageContent.contact?.email || 'Loading...'}</span>
							</button>
							<button class="flex items-center gap-3 text-left w-full" on:click={() => openLink(`tel:${pageContent.contact?.phone || ''}`)}>
								<Phone class="w-5 h-5 text-blue-600" />
								<span class="text-gray-600 hover:text-blue-600 transition-colors">{pageContent.contact?.phone || 'Loading...'}</span>
							</button>
							<div class="flex items-center gap-3">
								<MapPin class="w-5 h-5 text-blue-600" />
								<span class="text-gray-600">{pageContent.contact?.location || 'Loading...'}</span>
							</div>
						</div>
					</div>

					<div class="flex space-x-4">
						<Button class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3" on:click={() => openLink(`mailto:${pageContent.contact?.email || ''}`)}>
							<Mail class="w-4 h-4 mr-2" />
							Send Email
						</Button>
						<Button variant="outline" class="px-8 py-3">
							<Download class="w-4 h-4 mr-2" />
							Download CV
						</Button>
					</div>
				</div>

				<Card class="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-0">
					<CardContent class="p-0">
						<h3 class="text-xl font-semibold text-gray-900 mb-4">Quick Contact</h3>
						<form class="space-y-4" on:submit={handleContactForm}>
							<div>
								<input 
									type="text" 
									placeholder="Your Name" 
									name="name"
									class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>
							<div>
								<input 
									type="email" 
									placeholder="Your Email" 
									name="email"
									class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>
							<div>
								<textarea 
									placeholder="Your Message" 
									rows="4"
									name="message"
									class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
								></textarea>
							</div>
							<Button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3">
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
<footer class="py-12 bg-gray-900">
	<div class="container mx-auto px-4">
		<div class="text-center">
			<div class="text-white font-semibold text-lg mb-4">Portfolio</div>
			<p class="text-gray-400 mb-6">Transforming data into insights, insights into action.</p>
			<div class="flex justify-center space-x-6 mb-8">
				<button 
					on:click={() => openLink(pageContent.contact?.github || '')} 
					class="text-gray-400 hover:text-white transition-colors"
					aria-label="Visit GitHub profile"
				>
					<Github class="w-6 h-6" />
				</button>
				<button 
					on:click={() => openLink(pageContent.contact?.linkedin || '')} 
					class="text-gray-400 hover:text-white transition-colors"
					aria-label="Visit LinkedIn profile"
				>
					<Linkedin class="w-6 h-6" />
				</button>
				<button 
					on:click={() => scrollToSection('contact')} 
					class="text-gray-400 hover:text-white transition-colors"
					aria-label="Go to contact section"
				>
					<Mail class="w-6 h-6" />
				</button>
			</div>
			<div class="grid md:grid-cols-4 gap-6 mb-8 text-sm">
				<div>
					<h4 class="text-white font-medium mb-2">Navigation</h4>
					<div class="space-y-1">
						<button on:click={() => scrollToSection('about')} class="block text-gray-400 hover:text-white transition-colors">About</button>
						<button on:click={() => scrollToSection('services')} class="block text-gray-400 hover:text-white transition-colors">Services</button>
						<button on:click={() => scrollToSection('projects')} class="block text-gray-400 hover:text-white transition-colors">Projects</button>
					</div>
				</div>
				<div>
					<h4 class="text-white font-medium mb-2">Services</h4>
					<div class="space-y-1 text-gray-400">
						<div>Data Analytics</div>
						<div>Machine Learning</div>
						<div>Business Intelligence</div>
					</div>
				</div>
				<div>
					<h4 class="text-white font-medium mb-2">Contact</h4>
					<div class="space-y-1 text-gray-400">
						<div>{pageContent.contact?.email}</div>
						<div>{pageContent.contact?.phone}</div>
						<div>{pageContent.contact?.location}</div>
					</div>
				</div>
				<div>
					<h4 class="text-white font-medium mb-2">Resources</h4>
					<div class="space-y-1">
						<button class="block text-gray-400 hover:text-white transition-colors">Download Resume</button>
						<button on:click={() => scrollToSection('contact')} class="block text-gray-400 hover:text-white transition-colors">Get Quote</button>
						<button on:click={() => scrollToTop()} class="block text-gray-400 hover:text-white transition-colors">Back to Top</button>
					</div>
				</div>
			</div>
			<div class="border-t border-gray-800 pt-6">
				<div class="text-gray-400 text-sm">
					© 2024 Data Analyst Portfolio. All rights reserved. | Built with SvelteKit
				</div>
			</div>
		</div>
	</div>
</footer>

<!-- Scroll to Top Button -->
{#if showScrollTop}
	<button
		on:click={scrollToTop}
		class="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-40 animate-fade-in"
		aria-label="Scroll to top"
	>
		<ChevronUp class="w-6 h-6" />
	</button>
{/if}

{:else}
<!-- Loading State -->
<section class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
	<div class="text-center">
		<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
		<h1 class="text-2xl font-semibold text-gray-900">Loading Portfolio</h1>
		<p class="text-gray-600 mt-2">Please wait while we prepare your experience...</p>
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

