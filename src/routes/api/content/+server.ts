import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import dbConnect from '$lib/server/db';
import { Content } from '$lib/server/models/Content';
import type { Content as ContentType } from '$lib/types/content';

export async function GET() {
    try {
        await dbConnect();
        const content = await Content.findOne().sort({ createdAt: -1 });
        return json(content || {});
    } catch (error) {
        return json({ error: 'Failed to fetch content' }, { status: 500 });
    }
}

export async function POST({ request }: RequestEvent) {
    try {
        await dbConnect();
        const data: ContentType = await request.json();
        const content = await Content.create(data);
        return json(content);
    } catch (error) {
        return json({ error: 'Failed to create content' }, { status: 500 });
    }
}

export async function PUT({ request }: RequestEvent) {
    try {
        await dbConnect();
        const data: ContentType = await request.json();
        const content = await Content.findOne().sort({ createdAt: -1 });
        
        if (!content) {
            return json({ error: 'No content found' }, { status: 404 });
        }

        Object.assign(content, data);
        await content.save();
        return json(content);
    } catch (error) {
        return json({ error: 'Failed to update content' }, { status: 500 });
    }
} 