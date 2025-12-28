#!/usr/bin/env node

// Test the save functionality
const testContent = {
	hero: {
		title: 'TEST SAVE - Data Analyst',
		subtitle: 'Turning Numbers into Insights',
		description:
			'Testing save functionality - Transforming complex data into actionable business insights.',
		profileImage:
			'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'
	},
	stats: {
		yearsExperience: 99,
		projectsCompleted: 99,
		satisfiedClients: 99
	},
	about: {
		description:
			"TEST SAVE - I'm a passionate data analyst with expertise in transforming complex datasets into strategic business insights.",
		technicalExpertise: ['TEST SAVE - Advanced Statistical Analysis'],
		industryFocus: ['TEST SAVE - E-commerce & Retail']
	},
	services: [
		{
			title: 'TEST SAVE - Data Analytics',
			description: 'Testing save functionality',
			icon: 'BarChart3'
		}
	],
	projects: [
		{
			title: 'TEST SAVE - Customer Analytics Dashboard',
			description: 'Testing save functionality',
			technologies: ['TEST'],
			impact: 'TEST SAVE',
			link: 'https://github.com/test',
			image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop'
		}
	],
	skills: {
		programming: [{ name: 'TEST SAVE', level: 99 }]
	},
	experience: [
		{
			company: 'TEST SAVE - TechCorp Solutions',
			position: 'TEST SAVE - Senior Data Analyst',
			period: '2022 - Present',
			location: 'San Francisco, CA',
			description: 'Testing save functionality',
			achievements: ['TEST SAVE - Increased revenue by 18%']
		}
	],
	contact: {
		email: 'test@save.com',
		phone: '+1 (555) 123-4567',
		location: 'TEST SAVE - San Francisco, CA',
		github: 'https://github.com/testsave',
		linkedin: 'https://linkedin.com/in/testsave'
	}
};

async function testSave() {
	try {
		console.log('🧪 Testing content save functionality...');

		const response = await fetch('http://localhost:4173/api/content', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(testContent)
		});

		console.log('Response status:', response.status);

		if (!response.ok) {
			const errorText = await response.text();
			console.error('❌ Save failed:', response.status, errorText);
			return false;
		}

		const result = await response.json();
		console.log('✅ Save successful!');
		console.log('📄 Saved content has sections:', Object.keys(result));

		// Verify the content was actually saved
		console.log('🔍 Verifying saved content...');
		const verifyResponse = await fetch('http://localhost:4173/api/content');
		const savedContent = await verifyResponse.json();

		if (savedContent.hero.title === testContent.hero.title) {
			console.log('✅ Content verification successful!');
			console.log('📊 Hero title:', savedContent.hero.title);
			console.log('📈 Stats:', savedContent.stats);
			return true;
		} else {
			console.log('❌ Content verification failed');
			return false;
		}
	} catch (error) {
		console.error('❌ Test failed:', error);
		return false;
	}
}

testSave();
