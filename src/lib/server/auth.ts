import { env } from '$env/dynamic/private';
import { dev } from '$app/environment';
import { createHmac, randomBytes } from 'node:crypto';

const SESSION_SECRET = env.SESSION_SECRET || (dev ? 'dev-secret-key' : (() => { throw new Error('SESSION_SECRET is not set'); })());

export function createSessionToken(username: string): string {
    const data = JSON.stringify({ username, timestamp: Date.now() });
    const signature = createHmac('sha256', SESSION_SECRET).update(data).digest('hex');
    return Buffer.from(`${data}.${signature}`).toString('base64');
}

export function verifySessionToken(token: string): { username: string } | null {
    try {
        const decoded = Buffer.from(token, 'base64').toString('utf-8');
        const [dataStr, signature] = decoded.split('.');

        if (!dataStr || !signature) return null;

        const expectedSignature = createHmac('sha256', SESSION_SECRET).update(dataStr).digest('hex');

        if (signature !== expectedSignature) return null;

        const data = JSON.parse(dataStr);
        // Optional: Expiration check (e.g., 24 hours)
        if (Date.now() - data.timestamp > 24 * 60 * 60 * 1000) return null;

        return { username: data.username };
    } catch (e) {
        return null;
    }
}
