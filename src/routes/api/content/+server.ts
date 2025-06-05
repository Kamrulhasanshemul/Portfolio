import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ContentService } from '$lib/supabase';
import type { Content } from '$lib/types/content';

// Default content structure (fallback)
const defaultContent: Content = {
	hero: {
		title: 'Data Analyst',
		subtitle: 'Turning Numbers into Insights',
		description:
			'Transforming complex data into actionable business insights through advanced analytics and visualization techniques.',
		profileImage:
			'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'
	},
	stats: {
		yearsExperience: 5,
		projectsCompleted: 25,
		satisfiedClients: 15
	},
	about: {
		description:
			"I'm a passionate data analyst with expertise in transforming complex datasets into strategic business insights. With a strong background in statistical analysis, machine learning, and data visualization, I help organizations make data-driven decisions that drive growth and efficiency.",
		technicalExpertise: [
			'Advanced Statistical Analysis',
			'Machine Learning & AI',
			'Data Visualization',
			'Database Design & Management'
		],
		industryFocus: [
			'E-commerce & Retail',
			'Financial Services',
			'Healthcare Analytics',
			'Marketing & Customer Analytics'
		]
	},
	services: [
		{
			title: 'Data Analytics',
			description:
				'Transform raw data into actionable business insights with advanced statistical analysis and visualization.',
			icon: 'BarChart3'
		},
		{
			title: 'Machine Learning',
			description:
				'Build predictive models and AI solutions to automate decision-making and forecast trends.',
			icon: 'Brain'
		},
		{
			title: 'Data Engineering',
			description:
				'Design and implement robust data pipelines, warehouses, and ETL processes for scalable data operations.',
			icon: 'Database'
		},
		{
			title: 'Business Intelligence',
			description:
				'Create comprehensive dashboards and reporting systems for data-driven business strategies.',
			icon: 'Code'
		}
	],
	projects: [
		{
			title: 'Customer Analytics Dashboard',
			description:
				'Built an interactive dashboard tracking customer behavior across multiple touchpoints with real-time analytics and predictive insights.',
			technologies: ['Python', 'React', 'D3.js', 'PostgreSQL'],
			impact: 'Increased customer retention by 23%',
			link: 'https://github.com/example/customer-dashboard',
			image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop'
		},
		{
			title: 'Sales Forecasting Model',
			description:
				'Developed ML models using time series analysis to predict sales performance with 95% accuracy across multiple product lines.',
			technologies: ['Python', 'TensorFlow', 'Tableau', 'AWS'],
			impact: 'Improved forecast accuracy by 40%',
			link: 'https://github.com/example/sales-forecasting',
			image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop'
		},
		{
			title: 'Data Pipeline Automation',
			description:
				'Created scalable ETL pipelines processing 1M+ records daily with automated data quality checks and monitoring.',
			technologies: ['Apache Airflow', 'Docker', 'MongoDB', 'Grafana'],
			impact: 'Reduced processing time by 80%',
			link: 'https://github.com/example/data-pipeline',
			image: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=500&h=300&fit=crop'
		}
	],
	skills: {
		programming: [
			{ name: 'Python', level: 90 },
			{ name: 'R', level: 85 },
			{ name: 'SQL', level: 95 }
		],
		visualization: [
			{ name: 'Tableau', level: 92 },
			{ name: 'Power BI', level: 88 },
			{ name: 'D3.js', level: 80 }
		],
		databases: [
			{ name: 'PostgreSQL', level: 93 },
			{ name: 'MongoDB', level: 85 },
			{ name: 'BigQuery', level: 87 }
		],
		cloudAndTools: [
			{ name: 'AWS', level: 86 },
			{ name: 'Docker', level: 82 },
			{ name: 'Git', level: 90 }
		]
	},
	experience: [
		{
			company: 'TechCorp Solutions',
			position: 'Senior Data Analyst',
			period: '2022 - Present',
			location: 'San Francisco, CA',
			description:
				'Leading analytics initiatives for a $50M product portfolio, developing predictive models, and mentoring junior analysts.',
			achievements: [
				'Increased revenue by 18% through data-driven insights',
				'Automated reporting processes reducing manual work by 60%',
				'Built ML models improving customer segmentation accuracy by 35%'
			]
		},
		{
			company: 'DataInsights LLC',
			position: 'Data Analyst',
			period: '2020 - 2022',
			location: 'Remote',
			description:
				'Specialized in customer analytics and business intelligence for e-commerce and retail clients.',
			achievements: [
				'Improved forecast accuracy by 25% using time series analysis',
				'Created executive dashboards used by C-level leadership',
				'Reduced customer churn by 20% through predictive modeling'
			]
		}
	],
	contact: {
		email: 'hello@dataanalyst.com',
		phone: '+1 (555) 123-4567',
		location: 'San Francisco, CA',
		github: 'https://github.com/dataanalyst',
		linkedin: 'https://linkedin.com/in/dataanalyst'
	}
};

// GET - Fetch content from Supabase database
export const GET: RequestHandler = async () => {
	try {
		console.log('Fetching content from Supabase database...');
		const content = await ContentService.getContent();

		if (content) {
			console.log('Content retrieved from database');
			return json(content);
		} else {
			console.log('No content found in database, returning default content');
			// Save default content to database for next time
			await ContentService.saveContent(defaultContent);
			return json(defaultContent);
		}
	} catch (error) {
		console.error('Error fetching content from database:', error);
		// Return default content as fallback
		return json(defaultContent);
	}
};

// POST - Create new content in database
export const POST: RequestHandler = async ({ request }) => {
	try {
		const requestData = await request.json();
		const contentToSave = Object.keys(requestData).length > 0 ? requestData : defaultContent;

		console.log('Saving new content to Supabase database...');
		const result = await ContentService.saveContent(contentToSave);

		if (result.success) {
			console.log('Content successfully saved to database');
			return json(result.data);
		} else {
			console.error('Failed to save content:', result.error);
			return json({ error: 'Failed to save content' }, { status: 500 });
		}
	} catch (error) {
		console.error('Error creating content:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

// PUT - Update existing content in database
export const PUT: RequestHandler = async ({ request }) => {
	try {
		console.log('=== PUT REQUEST RECEIVED ===');
		const updatedContent = await request.json();
		console.log('Content received, sections:', Object.keys(updatedContent));

		// Validate that required sections exist
		const requiredSections = [
			'hero',
			'stats',
			'about',
			'services',
			'projects',
			'skills',
			'experience',
			'contact'
		];
		const missingSections = requiredSections.filter((section) => !updatedContent[section]);

		if (missingSections.length > 0) {
			console.warn('Missing required sections:', missingSections);
			return json(
				{ error: `Missing required sections: ${missingSections.join(', ')}` },
				{ status: 400 }
			);
		}

		console.log('All required sections present, saving to Supabase...');
		const result = await ContentService.saveContent(updatedContent);

		console.log('Supabase save result:', result);

		if (result.success) {
			console.log('Content successfully updated in database');
			return json(result.data);
		} else {
			console.error('Failed to update content:', result.error);
			console.error('Error details:', JSON.stringify(result.error, null, 2));
			return json({ error: 'Failed to update content', details: result.error }, { status: 500 });
		}
	} catch (error) {
		console.error('=== PUT REQUEST ERROR ===');
		console.error('Error updating content:', error);
		console.error('Error stack:', (error as Error).stack);
		return json(
			{ error: 'Internal server error', details: (error as Error).message },
			{ status: 500 }
		);
	}
};
