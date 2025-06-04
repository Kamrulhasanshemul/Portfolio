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
            // In production, this would be a secure API call
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