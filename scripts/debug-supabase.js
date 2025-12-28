#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://dttkwomsrqrjshuutiac.supabase.co';
const supabaseKey =
	process.env.SUPABASE_KEY ||
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0dGt3b21zcnFyanNodXV0aWFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNzY0NzksImV4cCI6MjA2NDY1MjQ3OX0._xG1W5ZePSHUzUTWBufnjBTzgP6GTSbgY-a2z38T1yw';

console.log('=== SUPABASE DEBUG ===');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'NOT FOUND');

const supabase = createClient(supabaseUrl, supabaseKey);

const testContent = {
	hero: {
		title: 'Debug Test',
		subtitle: 'Testing',
		description: 'Debug test',
		profileImage: '/test.jpg'
	},
	stats: { yearsExperience: 1, projectsCompleted: 1, satisfiedClients: 1 },
	about: { description: 'Debug test', technicalExpertise: ['Debug'], industryFocus: ['Debug'] },
	services: [{ title: 'Debug', description: 'Debug', icon: 'Star' }],
	projects: [
		{
			title: 'Debug',
			description: 'Debug',
			technologies: ['Debug'],
			impact: 'Debug',
			link: '',
			image: ''
		}
	],
	skills: { programming: [{ name: 'Debug', level: 50 }] },
	experience: [
		{
			company: 'Debug',
			position: 'Debug',
			period: 'Debug',
			location: 'Debug',
			description: 'Debug',
			achievements: ['Debug']
		}
	],
	contact: { email: 'debug@test.com', phone: '123', location: 'Debug', github: '', linkedin: '' }
};

async function debugSave() {
	try {
		console.log('\n1. Testing basic connection...');
		const { data: testData, error: testError } = await supabase
			.from('portfolio_content')
			.select('count')
			.limit(1);

		if (testError) {
			console.error('❌ Connection failed:', testError);
			return;
		}
		console.log('✅ Connection successful:', testData);

		console.log('\n2. Testing content save...');

		// First check existing content
		const { data: existing, error: selectError } = await supabase
			.from('portfolio_content')
			.select('id')
			.limit(1)
			.single();

		console.log('Existing content check:', { existing, selectError });

		if (existing) {
			console.log('Updating existing content with ID:', existing.id);
			const { data: updateData, error: updateError } = await supabase
				.from('portfolio_content')
				.update({
					content_data: testContent,
					updated_at: new Date().toISOString()
				})
				.eq('id', existing.id)
				.select()
				.single();

			if (updateError) {
				console.error('❌ Update failed:', updateError);
				return;
			}
			console.log('✅ Update successful:', Object.keys(updateData.content_data));
		} else {
			console.log('Creating new content...');
			const { data: insertData, error: insertError } = await supabase
				.from('portfolio_content')
				.insert({
					content_data: testContent,
					created_at: new Date().toISOString(),
					updated_at: new Date().toISOString()
				})
				.select()
				.single();

			if (insertError) {
				console.error('❌ Insert failed:', insertError);
				return;
			}
			console.log('✅ Insert successful:', Object.keys(insertData.content_data));
		}

		console.log('\n3. Verifying saved content...');
		const { data: verifyData, error: verifyError } = await supabase
			.from('portfolio_content')
			.select('*')
			.limit(1)
			.single();

		if (verifyError) {
			console.error('❌ Verification failed:', verifyError);
			return;
		}

		console.log('✅ Verification successful');
		console.log('Saved content sections:', Object.keys(verifyData.content_data));
		console.log('Hero title:', verifyData.content_data.hero.title);
	} catch (err) {
		console.error('❌ Unexpected error:', err);
	}
}

debugSave();
