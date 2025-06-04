import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import type { Content as ContentType } from '$lib/types/content';

// Simple in-memory storage for demo purposes
// In production, you'd want to use Cloudflare KV, D1, or a cloud database
let contentStorage: ContentType | null = null;

const defaultContent: ContentType = {
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

export async function GET() {
    try {
        const content = contentStorage || defaultContent;
        return json(content);
    } catch (error) {
        return json({ error: 'Failed to fetch content' }, { status: 500 });
    }
}

export async function POST({ request }: RequestEvent) {
    try {
        const data: ContentType = await request.json();
        contentStorage = {
            ...data,
            _id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        return json(contentStorage);
    } catch (error) {
        return json({ error: 'Failed to create content' }, { status: 500 });
    }
}

export async function PUT({ request }: RequestEvent) {
    try {
        const data: ContentType = await request.json();
        contentStorage = {
            ...data,
            _id: contentStorage?._id || crypto.randomUUID(),
            createdAt: contentStorage?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        return json(contentStorage);
    } catch (error) {
        return json({ error: 'Failed to update content' }, { status: 500 });
    }
} 