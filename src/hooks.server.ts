import { redirect, type Handle } from '@sveltejs/kit';
import { verifySessionToken } from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
    const sessionCookie = event.cookies.get('session');
    const user = sessionCookie ? verifySessionToken(sessionCookie) : null;

    if (user) {
        event.locals.user = user;
    }

    const path = event.url.pathname;

    // Protect Admin Routes
    if (path.startsWith('/admin') && path !== '/admin/login') {
        if (!user) {
            throw redirect(303, '/admin/login');
        }
    }

    // Protect Admin API Routes
    if (path.startsWith('/api/admin')) {
        // Allow login endpoint
        const isLogin = path === '/api/admin' && event.request.method === 'POST';

        if (!isLogin && !user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' } // Use standard application/json
            });
        }
    }

    const response = await resolve(event);
    return response;
};
