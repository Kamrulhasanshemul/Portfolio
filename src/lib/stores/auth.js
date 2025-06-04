import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// In a real application, you would want to store this securely and not in the code
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

const createAuthStore = () => {
    const { subscribe, set } = writable({
        isAuthenticated: false,
        user: null,
        initialized: false
    });

    return {
        subscribe,
        login: (username, password) => {
            if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
                set({
                    isAuthenticated: true,
                    user: { username },
                    initialized: true
                });
                if (browser) {
                    localStorage.setItem('admin-auth', 'true');
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
            }
        },
        checkAuth: () => {
            if (browser) {
                const isAuth = localStorage.getItem('admin-auth') === 'true';
                set({
                    isAuthenticated: isAuth,
                    user: isAuth ? { username: ADMIN_CREDENTIALS.username } : null,
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