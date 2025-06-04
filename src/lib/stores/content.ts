import { writable } from 'svelte/store';
import type { Content } from '$lib/types/content';

const defaultContent: Content = {
    hero: {
        title: "Data Analyst",
        subtitle: "Turning Numbers into Insights",
        description: "Transforming complex data into actionable business insights through advanced analytics and visualization techniques.",
        profileImage: "/profile-photo.jpg"
    },
    stats: {
        yearsExperience: 5,
        projectsCompleted: 25,
        satisfiedClients: 15
    },
    skills: {
        programming: [
            { name: "Python", level: 90 },
            { name: "R", level: 85 },
            { name: "SQL", level: 95 }
        ],
        visualization: [
            { name: "Tableau", level: 92 },
            { name: "Power BI", level: 88 },
            { name: "D3.js", level: 80 }
        ],
        databases: [
            { name: "PostgreSQL", level: 93 },
            { name: "MongoDB", level: 85 },
            { name: "BigQuery", level: 87 }
        ],
        cloudAndTools: [
            { name: "AWS", level: 86 },
            { name: "Docker", level: 82 },
            { name: "Git", level: 90 }
        ]
    }
};

function createContentStore() {
    const { subscribe, set } = writable<Content>(defaultContent);

    return {
        subscribe,
        init: async () => {
            try {
                const response = await fetch('/api/content');
                const data = await response.json();
                if (Object.keys(data).length > 0) {
                    set(data);
                } else {
                    // If no content exists, create initial content
                    const createResponse = await fetch('/api/content', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(defaultContent)
                    });
                    const newData = await createResponse.json();
                    set(newData);
                }
            } catch (error) {
                console.error('Failed to initialize content:', error);
                set(defaultContent);
            }
        },
        update: async (newContent: Content) => {
            try {
                const response = await fetch('/api/content', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newContent)
                });
                const data = await response.json();
                set(data);
                return true;
            } catch (error) {
                console.error('Failed to update content:', error);
                return false;
            }
        }
    };
}

export const content = createContentStore(); 