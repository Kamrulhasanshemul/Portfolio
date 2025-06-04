<script lang="ts">
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { BarChart3, TrendingUp, Database, Brain, Mail, Github, Linkedin, Plus, Edit3, Trash2, Save, X, Settings, User, Briefcase, Award, ExternalLink } from 'lucide-svelte';
  import { Alert, AlertDescription } from '$lib/components/ui/alert';

  // Portfolio data store
  const initialPortfolioData = {
    personal: {
      name: "Alex Chen",
      title: "Senior Data Analyst",
      bio: "Passionate data analyst with 5+ years of experience turning complex datasets into actionable business insights. Specialized in predictive modeling, data visualization, and statistical analysis.",
      email: "alex.chen@email.com",
      github: "github.com/alexchen",
      linkedin: "linkedin.com/in/alexchen",
      location: "San Francisco, CA"
    },
    projects: [
      {
        id: 1,
        title: "Customer Churn Prediction Model",
        description: "Built a machine learning model to predict customer churn with 87% accuracy, helping reduce churn by 23%",
        technologies: ["Python", "Scikit-learn", "Pandas", "Tableau"],
        impact: "23% reduction in customer churn",
        link: "#"
      },
      {
        id: 2,
        title: "Sales Performance Dashboard",
        description: "Created an interactive dashboard tracking key sales metrics across 15 regions, enabling data-driven decision making",
        technologies: ["Power BI", "SQL", "DAX", "Azure"],
        impact: "$2M increase in quarterly revenue",
        link: "#"
      },
      {
        id: 3,
        title: "Market Basket Analysis",
        description: "Analyzed purchasing patterns to optimize product placement and cross-selling opportunities",
        technologies: ["R", "Association Rules", "ggplot2", "Shiny"],
        impact: "15% increase in average order value",
        link: "#"
      }
    ],
    skills: [
      { category: "Programming", items: ["Python", "R", "SQL", "JavaScript"] },
      { category: "Tools", items: ["Tableau", "Power BI", "Excel", "Jupyter"] },
      { category: "Databases", items: ["PostgreSQL", "MySQL", "MongoDB", "BigQuery"] },
      { category: "Cloud", items: ["AWS", "Azure", "GCP", "Snowflake"] },
      { category: "Statistics", items: ["Regression", "Hypothesis Testing", "A/B Testing", "Time Series"] }
    ],
    experience: [
      {
        id: 1,
        company: "TechCorp Inc.",
        position: "Senior Data Analyst",
        period: "2022 - Present",
        achievements: [
          "Led analytics for $50M product line, driving 18% revenue growth",
          "Developed automated reporting system reducing manual work by 60%",
          "Mentored 3 junior analysts and established best practices"
        ]
      },
      {
        id: 2,
        company: "DataInsights LLC",
        position: "Data Analyst",
        period: "2020 - 2022",
        achievements: [
          "Built predictive models improving forecast accuracy by 25%",
          "Created executive dashboards used by C-level leadership",
          "Collaborated with cross-functional teams on data initiatives"
        ]
      }
    ]
  };

  // Svelte stores for state
  const portfolioData = writable(structuredClone(initialPortfolioData));
  const activeSection = writable('portfolio');
  const showCMS = writable(false);
  const editingItem = writable(null);
  const formData = writable({});

  // Handlers
  function handleEdit(section: string, item: any = null) {
    editingItem.set({ section, item });
    if (item) {
      formData.set({ ...item });
    } else {
      formData.set({});
    }
  }

  function handleSave() {
    let $editingItem, $formData;
    editingItem.subscribe(v => $editingItem = v)();
    formData.subscribe(v => $formData = v)();

    portfolioData.update(prev => {
      if ($editingItem.section === 'personal') {
        prev.personal = { ...prev.personal, ...$formData };
      } else if ($editingItem.section === 'projects') {
        if ($editingItem.item) {
          prev.projects = prev.projects.map(p => p.id === $editingItem.item.id ? { ...$formData, id: $editingItem.item.id } : p);
        } else {
          prev.projects = [...prev.projects, { ...$formData, id: Date.now() }];
        }
      } else if ($editingItem.section === 'experience') {
        if ($editingItem.item) {
          prev.experience = prev.experience.map(e => e.id === $editingItem.item.id ? { ...$formData, id: $editingItem.item.id } : e);
        } else {
          prev.experience = [...prev.experience, { ...$formData, id: Date.now() }];
        }
      }
      return prev;
    });
    editingItem.set(null);
    formData.set({});
  }

  function handleDelete(section: string, id: number) {
    portfolioData.update(prev => {
      prev[section] = prev[section].filter((item: any) => item.id !== id);
      return prev;
    });
  }
</script>
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
