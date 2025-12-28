
import type { PageServerLoad } from './$types';
import { ContentService } from '$lib/supabase';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
    try {
        console.log('Server load: Fetching content...');
        const content = await ContentService.getContent();

        if (content) {
            return { content };
        }

        // If no content found, return null (the page will handle defaults or store init)
        // But ideally we want to return something or the default structure
        return { content: null };
    } catch (err) {
        console.error('Server load error:', err);
        throw error(500, 'Failed to load content');
    }
};
