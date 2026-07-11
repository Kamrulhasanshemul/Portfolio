import { json } from '@sveltejs/kit';
import { dev } from '$app/environment';
import type { RequestHandler } from './$types';
import { AdminService } from '$lib/admin';
import { createSessionToken } from '$lib/server/auth';

// GET - List all admin users
export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const result = await AdminService.getAdminUsers();

		if (result.success) {
			return json({ users: result.users });
		} else {
			return json({ error: 'Failed to fetch admin users' }, { status: 500 });
		}
	} catch (error) {
		console.error('Error fetching admin users:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};

// POST - Create new admin user
export const POST: RequestHandler = async ({ request, cookies, locals }) => {
	try {
		const { action, ...data } = await request.json();

		if (action !== 'authenticate' && !locals.user) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		switch (action) {
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

			case 'authenticate': {
				const authResult = await AdminService.authenticateAdmin(data.username, data.password);

				if (authResult.success) {
					// Create and set session cookie
					const token = createSessionToken(data.username);
					cookies.set('session', token, {
						path: '/',
						httpOnly: true,
						sameSite: 'strict',
						secure: !dev,
						maxAge: 60 * 60 * 24 // 1 day
					});

					return json({
						message: authResult.message,
						user: authResult.user
					});
				} else {
					return json({ error: authResult.message }, { status: 401 });
				}
			}

			case 'initialize': {
				// Initialize should strictly check if system is already initialized too?
				// AdminService.initializeAdminTable() handles idempotent creation, but createDefaultAdmin might fail.
				const initResult = await AdminService.initializeAdminTable();
				if (initResult) {
					const adminResult = await AdminService.createDefaultAdmin();
					if (adminResult) {
						return json({ message: 'Admin system initialized successfully' });
					}
				}
				return json({ error: 'Failed to initialize admin system' }, { status: 500 });
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
