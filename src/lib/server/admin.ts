import { supabaseAdmin } from './supabase';
import bcrypt from 'bcryptjs';

export interface AdminUser {
	id: string;
	username: string;
	email: string;
	role: 'admin' | 'editor';
	created_at: string;
	updated_at: string;
	last_login?: string;
}

const PUBLIC_COLUMNS = 'id, username, email, role, created_at, updated_at, last_login';

export class AdminService {
	// Count admin users (used for first-time setup detection)
	static async countAdmins(): Promise<number> {
		const { count, error } = await supabaseAdmin
			.from('admin_users')
			.select('id', { count: 'exact', head: true });

		if (error) {
			console.error('Error counting admin users:', error);
			return -1;
		}
		return count ?? 0;
	}

	// Authenticate admin user
	static async authenticateAdmin(username: string, password: string) {
		try {
			const { data: user, error } = await supabaseAdmin
				.from('admin_users')
				.select('*')
				.eq('username', username)
				.single();

			if (error || !user) {
				return { success: false, message: 'Invalid username or password' };
			}

			const isValid = await bcrypt.compare(password, user.password_hash);

			if (!isValid) {
				return { success: false, message: 'Invalid username or password' };
			}

			await supabaseAdmin
				.from('admin_users')
				.update({ last_login: new Date().toISOString() })
				.eq('id', user.id);

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { password_hash, ...userWithoutPassword } = user;

			return {
				success: true,
				user: userWithoutPassword,
				message: 'Authentication successful'
			};
		} catch (err) {
			console.error('Authentication error:', err);
			return { success: false, message: 'Authentication failed' };
		}
	}

	// Create new admin user
	static async createAdmin(userData: {
		username: string;
		email: string;
		password: string;
		role?: 'admin' | 'editor';
	}) {
		try {
			if (!userData.username || !userData.email || !userData.password) {
				return { success: false, message: 'Username, email and password are required' };
			}
			if (userData.password.length < 8) {
				return { success: false, message: 'Password must be at least 8 characters' };
			}

			const { data: existing } = await supabaseAdmin
				.from('admin_users')
				.select('username, email')
				.or(`username.eq.${userData.username},email.eq.${userData.email}`);

			if (existing && existing.length > 0) {
				const conflict = existing[0].username === userData.username ? 'Username' : 'Email';
				return { success: false, message: `${conflict} already exists` };
			}

			const passwordHash = await bcrypt.hash(userData.password, 12);

			const { data, error } = await supabaseAdmin
				.from('admin_users')
				.insert({
					username: userData.username,
					email: userData.email,
					password_hash: passwordHash,
					role: userData.role || 'admin'
				})
				.select(PUBLIC_COLUMNS)
				.single();

			if (error) {
				console.error('Error creating admin user:', error);
				return { success: false, message: 'Failed to create admin user' };
			}

			return { success: true, user: data, message: 'User created successfully' };
		} catch (err) {
			console.error('Error creating admin:', err);
			return { success: false, message: 'Failed to create admin user' };
		}
	}

	// List all admin users (never exposes password hashes)
	static async getAdminUsers() {
		try {
			const { data, error } = await supabaseAdmin
				.from('admin_users')
				.select(PUBLIC_COLUMNS)
				.order('created_at', { ascending: false });

			if (error) {
				console.error('Error fetching admin users:', error);
				return { success: false, users: [] };
			}

			return { success: true, users: (data || []) as AdminUser[] };
		} catch (err) {
			console.error('Error getting admin users:', err);
			return { success: false, users: [] };
		}
	}

	// Update admin user
	static async updateAdmin(
		id: string,
		updates: {
			username?: string;
			email?: string;
			password?: string;
			role?: 'admin' | 'editor';
		}
	) {
		try {
			const updateData: {
				username?: string;
				email?: string;
				role?: 'admin' | 'editor';
				password_hash?: string;
			} = {};

			if (updates.username) updateData.username = updates.username;
			if (updates.email) updateData.email = updates.email;
			if (updates.role) updateData.role = updates.role;

			if (updates.password) {
				if (updates.password.length < 8) {
					return { success: false, message: 'Password must be at least 8 characters' };
				}
				updateData.password_hash = await bcrypt.hash(updates.password, 12);
			}

			if (Object.keys(updateData).length === 0) {
				return { success: false, message: 'Nothing to update' };
			}

			const { data, error } = await supabaseAdmin
				.from('admin_users')
				.update(updateData)
				.eq('id', id)
				.select(PUBLIC_COLUMNS)
				.single();

			if (error) {
				console.error('Error updating admin user:', error);
				return { success: false, message: 'Failed to update admin user' };
			}

			return { success: true, user: data, message: 'User updated successfully' };
		} catch (err) {
			console.error('Error updating admin:', err);
			return { success: false, message: 'Failed to update admin user' };
		}
	}

	// Delete admin user
	static async deleteAdmin(id: string) {
		try {
			// Never delete the last remaining user — that would lock the panel forever
			const total = await this.countAdmins();
			if (total === 1) {
				return { success: false, message: 'Cannot delete the last admin user' };
			}

			const { error } = await supabaseAdmin.from('admin_users').delete().eq('id', id);

			if (error) {
				console.error('Error deleting admin user:', error);
				return { success: false, message: 'Failed to delete admin user' };
			}

			return { success: true, message: 'User deleted successfully' };
		} catch (err) {
			console.error('Error deleting admin:', err);
			return { success: false, message: 'Failed to delete admin user' };
		}
	}

	// Look up a user by username (for self-delete protection)
	static async getAdminByUsername(username: string) {
		const { data } = await supabaseAdmin
			.from('admin_users')
			.select(PUBLIC_COLUMNS)
			.eq('username', username)
			.single();
		return data as AdminUser | null;
	}
}
