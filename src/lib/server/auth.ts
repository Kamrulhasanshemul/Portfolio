import { env } from '$env/dynamic/private';
import { dev } from '$app/environment';
import { createHmac, timingSafeEqual } from 'node:crypto';

// Resolved lazily so a missing SESSION_SECRET fails at first use (with a clear
// error) instead of crashing module load during the build's prerender analysis.
function getSessionSecret(): string {
	const secret = env.SESSION_SECRET || (dev ? 'dev-secret-key' : '');
	if (!secret) {
		throw new Error('SESSION_SECRET is not set');
	}
	return secret;
}

export function createSessionToken(username: string): string {
	const data = JSON.stringify({ username, timestamp: Date.now() });
	const signature = createHmac('sha256', getSessionSecret()).update(data).digest('hex');
	return Buffer.from(`${data}.${signature}`).toString('base64');
}

export function verifySessionToken(token: string): { username: string } | null {
	try {
		const decoded = Buffer.from(token, 'base64').toString('utf-8');
		// The payload is JSON and may itself contain '.', so split on the last one
		const separator = decoded.lastIndexOf('.');
		if (separator === -1) return null;
		const dataStr = decoded.slice(0, separator);
		const signature = decoded.slice(separator + 1);

		if (!dataStr || !signature) return null;

		const expectedSignature = createHmac('sha256', getSessionSecret())
			.update(dataStr)
			.digest('hex');

		const signatureBuf = Buffer.from(signature);
		const expectedBuf = Buffer.from(expectedSignature);
		if (signatureBuf.length !== expectedBuf.length || !timingSafeEqual(signatureBuf, expectedBuf)) {
			return null;
		}

		const data = JSON.parse(dataStr);
		// Optional: Expiration check (e.g., 24 hours)
		if (Date.now() - data.timestamp > 24 * 60 * 60 * 1000) return null;

		return { username: data.username };
	} catch {
		return null;
	}
}
