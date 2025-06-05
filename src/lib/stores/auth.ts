import { writable } from 'svelte/store';
import { browser } from '$app/environment';

interface User {
    username: string;
}

interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    initialized: boolean;
}

const createAuthStore = () => {
    const { subscribe, set } = writable<AuthState>({
        isAuthenticated: false,
        user: null,
        initialized: false
    });

    return {
        subscribe,
        login: async (username: string, password: string): Promise<boolean> => {
            try {
                // Try to authenticate with API first
                const response = await fetch('/api/admin', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        action: 'authenticate',
                        username,
                        password
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    set({
                        isAuthenticated: true,
                        user: { username: data.user.username },
                        initialized: true
                    });
                    if (browser) {
                        localStorage.setItem('admin-auth', 'true');
                        localStorage.setItem('admin-user', data.user.username);
                    }
                    return true;
                }
            } catch (error) {
                console.warn('API authentication failed, falling back to default:', error);
            }

            // Fallback for development
            const defaultUsername = 'admin';
            const defaultPassword = 'admin123';
            
            if (username === defaultUsername && password === defaultPassword) {
                set({
                    isAuthenticated: true,
                    user: { username },
                    initialized: true
                });
                if (browser) {
                    localStorage.setItem('admin-auth', 'true');
                    localStorage.setItem('admin-user', username);
                }
                return true;
            }
            return false;
        },
        logout: () => {
            set({
                isAuthenticated: false,
                user: null,
                initialized: true
            });
            if (browser) {
                localStorage.removeItem('admin-auth');
                localStorage.removeItem('admin-user');
            }
        },
        checkAuth: () => {
            if (browser) {
                const isAuth = localStorage.getItem('admin-auth') === 'true';
                const username = localStorage.getItem('admin-user');
                set({
                    isAuthenticated: isAuth,
                    user: isAuth && username ? { username } : null,
                    initialized: true
                });
            } else {
                set({
                    isAuthenticated: false,
                    user: null,
                    initialized: true
                });
            }
        }
    };
};

export const auth = createAuthStore(); 