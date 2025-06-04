import { writable } from 'svelte/store';

// Initial content state
const defaultContent = {
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

// Create the store
const content = writable(defaultContent);

// Load content from localStorage if available
if (typeof window !== 'undefined') {
    const savedContent = localStorage.getItem('cms-content');
    if (savedContent) {
        content.set(JSON.parse(savedContent));
    }
}

// Subscribe to changes and save to localStorage
if (typeof window !== 'undefined') {
    content.subscribe(value => {
        localStorage.setItem('cms-content', JSON.stringify(value));
    });
}

export { content }; 