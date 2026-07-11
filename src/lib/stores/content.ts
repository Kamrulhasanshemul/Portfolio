import { writable } from 'svelte/store';
import type { Content } from '$lib/types/content';
import { defaultContent } from '$lib/default-content';

function createContentStore() {
	const { subscribe, set } = writable<Content>(defaultContent);
	let initialized = false;

	return {
		subscribe,
		set,
		init: async () => {
			if (initialized) {
				return;
			}

			try {
				const response = await fetch('/api/content');
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const data = await response.json();

				// Validate that we have all required sections
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
				const missingSections = requiredSections.filter((section) => !data[section]);

				if (missingSections.length > 0) {
					console.warn('Missing sections in API response:', missingSections);
					// Merge with default content to ensure completeness
					const completeData = { ...defaultContent, ...data };
					set(completeData);
				} else if (Object.keys(data).length > 0 && data.hero) {
					set(data);
				} else {
					// If no content exists, create initial content
					const createResponse = await fetch('/api/content', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify(defaultContent)
					});

					if (!createResponse.ok) {
						throw new Error(`Create failed: ${createResponse.status}`);
					}

					const newData = await createResponse.json();
					set(newData);
				}

				initialized = true;
			} catch (error) {
				console.error('Failed to initialize content:', error);
				set(defaultContent);
				initialized = true;
			}
		},
		update: async (newContent: Content) => {
			// Validate content before sending
			if (!newContent.hero || !newContent.stats || !newContent.about) {
				console.error('Invalid content structure - missing required sections');
				return false;
			}

			try {
				const response = await fetch('/api/content', {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(newContent)
				});

				if (!response.ok) {
					const errorText = await response.text();
					console.error('PUT request failed:', response.status, errorText);
					throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
				}

				const data = await response.json();

				// Immediately update the store with the new data
				set(data);
				return true;
			} catch (error) {
				console.error('Failed to update content:', error);
				return false;
			}
		},
		// Force refresh from API
		refresh: async () => {
			try {
				const response = await fetch('/api/content');
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const data = await response.json();

				// Validate and merge if necessary
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
				const missingSections = requiredSections.filter((section) => !data[section]);

				if (missingSections.length > 0) {
					console.warn('Missing sections in refresh response:', missingSections);
					const completeData = { ...defaultContent, ...data };
					set(completeData);
				} else {
					set(data);
				}

				return true;
			} catch (error) {
				console.error('Failed to refresh content:', error);
				return false;
			}
		}
	};
}

export const content = createContentStore();
