import { writable } from 'svelte/store';

interface User {
	username: string;
}

interface AuthState {
	isAuthenticated: boolean;
	user: User | null;
}

// Session truth lives in the httpOnly cookie (set/cleared by /api/admin).
// This store only mirrors it for UI purposes — the server layout provides
// the authoritative user via `locals.user`.
const createAuthStore = () => {
	const { subscribe, set } = writable<AuthState>({
		isAuthenticated: false,
		user: null
	});

	return {
		subscribe,
		// Hydrate from server-provided data (admin +layout.server.ts)
		setUser: (user: User | null) => {
			set({ isAuthenticated: !!user, user });
		},
		login: async (
			username: string,
			password: string
		): Promise<{ success: boolean; error?: string }> => {
			try {
				const response = await fetch('/api/admin', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ action: 'authenticate', username, password })
				});

				const data = await response.json();

				if (response.ok) {
					set({ isAuthenticated: true, user: { username: data.user.username } });
					return { success: true };
				}
				return { success: false, error: data.error || 'Invalid credentials' };
			} catch (error) {
				console.error('Login request failed:', error);
				return { success: false, error: 'Login failed. Please try again.' };
			}
		},
		logout: async (): Promise<void> => {
			try {
				await fetch('/api/admin', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ action: 'logout' })
				});
			} catch (error) {
				console.error('Logout request failed:', error);
			}
			set({ isAuthenticated: false, user: null });
		}
	};
};

export const auth = createAuthStore();
