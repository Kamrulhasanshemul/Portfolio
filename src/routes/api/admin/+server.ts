import { json } from '@sveltejs/kit';
import { dev } from '$app/environment';
import type { RequestHandler } from './$types';
import { AdminService } from '$lib/server/admin';
import { createSessionToken } from '$lib/server/auth';

const SESSION_COOKIE = 'session';

// GET - List all admin users
export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const result = await AdminService.getAdminUsers();

		if (result.success) {
			return json({ users: result.users, currentUsername: locals.user.username });
		} else {
			return json({ error: 'Failed to fetch admin users' }, { status: 500 });
		}
	} catch (error) {
		console.error('Error fetching admin users:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

// POST - Auth actions and user creation
export const POST: RequestHandler = async ({ request, cookies, locals }) => {
	try {
		const { action, ...data } = await request.json();

		// 'authenticate', 'logout' and 'setup-status'/'initialize' (first-time
		// bootstrap) work without a session; everything else requires one.
		const publicActions = ['authenticate', 'logout', 'setup-status', 'initialize'];
		if (!publicActions.includes(action) && !locals.user) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		switch (action) {
			case 'authenticate': {
				const authResult = await AdminService.authenticateAdmin(data.username, data.password);

				if (authResult.success) {
					const token = createSessionToken(data.username);
					cookies.set(SESSION_COOKIE, token, {
						path: '/',
						httpOnly: true,
						sameSite: 'strict',
						secure: !dev,
						maxAge: 60 * 60 * 24 // 1 day (matches token expiry)
					});

					return json({
						message: authResult.message,
						user: authResult.user
					});
				} else {
					return json({ error: authResult.message }, { status: 401 });
				}
			}

			case 'logout': {
				cookies.delete(SESSION_COOKIE, { path: '/' });
				return json({ message: 'Logged out' });
			}

			case 'setup-status': {
				// Lets the login page know whether first-time setup is needed
				const count = await AdminService.countAdmins();
				return json({ needsSetup: count === 0 });
			}

			case 'initialize': {
				// First-time bootstrap: only allowed while no admin user exists,
				// so this can never be used to add users to a configured system.
				const count = await AdminService.countAdmins();
				if (count !== 0) {
					return json({ error: 'Admin system is already initialized' }, { status: 403 });
				}

				const createResult = await AdminService.createAdmin({
					username: data.username,
					email: data.email,
					password: data.password,
					role: 'admin'
				});

				if (!createResult.success) {
					return json({ error: createResult.message }, { status: 400 });
				}

				// Log the new admin straight in
				const token = createSessionToken(data.username);
				cookies.set(SESSION_COOKIE, token, {
					path: '/',
					httpOnly: true,
					sameSite: 'strict',
					secure: !dev,
					maxAge: 60 * 60 * 24
				});

				return json({ message: 'Admin account created', user: createResult.user });
			}

			case 'create': {
				const createResult = await AdminService.createAdmin({
					username: data.username,
					email: data.email,
					password: data.password,
					role: data.role || 'admin'
				});

				if (createResult.success) {
					return json({
						message: createResult.message,
						user: createResult.user
					});
				} else {
					return json({ error: createResult.message }, { status: 400 });
				}
			}

			default:
				return json({ error: 'Invalid action' }, { status: 400 });
		}
	} catch (error) {
		console.error('Error processing admin request:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

// PUT - Update admin user
export const PUT: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { id, ...updates } = await request.json();

		if (!id) {
			return json({ error: 'Admin user ID is required' }, { status: 400 });
		}

		const result = await AdminService.updateAdmin(id, updates);

		if (result.success) {
			return json({
				message: result.message,
				user: result.user
			});
		} else {
			return json({ error: result.message }, { status: 400 });
		}
	} catch (error) {
		console.error('Error updating admin user:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

// DELETE - Delete admin user
export const DELETE: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { id } = await request.json();

		if (!id) {
			return json({ error: 'Admin user ID is required' }, { status: 400 });
		}

		// Prevent deleting your own account while logged in with it
		const self = await AdminService.getAdminByUsername(locals.user.username);
		if (self && self.id === id) {
			return json({ error: 'You cannot delete your own account' }, { status: 400 });
		}

		const result = await AdminService.deleteAdmin(id);

		if (result.success) {
			return json({ message: result.message });
		} else {
			return json({ error: result.message }, { status: 400 });
		}
	} catch (error) {
		console.error('Error deleting admin user:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
