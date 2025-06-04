import { writable } from 'svelte/store';

// In a real application, you would want to store this securely and not in the code
const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
};

const createAuthStore = () => {
    const { subscribe, set } = writable({
        isAuthenticated: false,
        user: null
    });

    return {
        subscribe,
        login: (username, password) => {
            if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
                set({
                    isAuthenticated: true,
                    user: { username }
                });
                if (typeof window !== 'undefined') {
                    localStorage.setItem('admin-auth', 'true');
                }
                return true;
            }
            return false;
        },
        logout: () => {
            set({
                isAuthenticated: false,
                user: null
            });
            if (typeof window !== 'undefined') {
                localStorage.removeItem('admin-auth');
            }
        },
        checkAuth: () => {
            if (typeof window !== 'undefined') {
                const isAuth = localStorage.getItem('admin-auth') === 'true';
                if (isAuth) {
                    set({
                        isAuthenticated: true,
                        user: { username: ADMIN_CREDENTIALS.username }
                    });
                }
            }
        }
    };
};

export const auth = createAuthStore(); 