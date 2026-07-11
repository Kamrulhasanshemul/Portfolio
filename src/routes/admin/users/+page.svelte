<svelte:options runes={true} />

<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Badge } from '$lib/components/ui/badge';
	import * as Card from '$lib/components/ui/card';
	import * as Select from '$lib/components/ui/select';
	import * as Table from '$lib/components/ui/table';
	import { Plus, RefreshCw, Edit, Trash2, ArrowLeft, ShieldCheck, KeyRound } from '@lucide/svelte';

	interface AdminUser {
		id: string;
		username: string;
		email: string;
		role: 'admin' | 'editor';
		created_at: string;
		updated_at: string;
		last_login?: string;
	}

	let users = $state<AdminUser[]>([]);
	let currentUsername = $state('');
	let loading = $state(false);
	let saving = $state(false);
	let error = $state('');
	let success = $state('');

	// Editor state — null means the list is showing
	let editingUser = $state<{
		id?: string;
		username: string;
		email: string;
		password: string;
		confirmPassword: string;
		role: 'admin' | 'editor';
	} | null>(null);

	$effect(() => {
		loadUsers();
	});

	async function loadUsers() {
		loading = true;
		error = '';
		try {
			const response = await fetch('/api/admin');
			const result = await response.json();
			if (response.ok) {
				users = result.users || [];
				currentUsername = result.currentUsername || '';
			} else {
				error = result.error || 'Failed to load users';
			}
		} catch (err) {
			console.error('Error loading users:', err);
			error = 'Failed to load users';
		} finally {
			loading = false;
		}
	}

	function startNewUser() {
		editingUser = {
			username: '',
			email: '',
			password: '',
			confirmPassword: '',
			role: 'admin'
		};
		error = '';
		success = '';
	}

	function startEditUser(user: AdminUser) {
		editingUser = {
			id: user.id,
			username: user.username,
			email: user.email,
			password: '',
			confirmPassword: '',
			role: user.role
		};
		error = '';
		success = '';
	}

	function cancelEdit() {
		editingUser = null;
		error = '';
	}

	async function saveUser() {
		if (!editingUser) return;

		if (!editingUser.username || !editingUser.email) {
			error = 'Username and email are required';
			return;
		}
		const isNew = !editingUser.id;
		if (isNew && !editingUser.password) {
			error = 'Password is required for new users';
			return;
		}
		if (editingUser.password) {
			if (editingUser.password.length < 8) {
				error = 'Password must be at least 8 characters';
				return;
			}
			if (editingUser.password !== editingUser.confirmPassword) {
				error = 'Passwords do not match';
				return;
			}
		}

		saving = true;
		error = '';

		try {
			let response: Response;
			if (isNew) {
				response = await fetch('/api/admin', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						action: 'create',
						username: editingUser.username,
						email: editingUser.email,
						password: editingUser.password,
						role: editingUser.role
					})
				});
			} else {
				const updates: Record<string, string> = {
					id: editingUser.id!,
					username: editingUser.username,
					email: editingUser.email,
					role: editingUser.role
				};
				if (editingUser.password) updates.password = editingUser.password;

				response = await fetch('/api/admin', {
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(updates)
				});
			}

			const result = await response.json();
			if (response.ok) {
				success = result.message || 'Saved';
				editingUser = null;
				await loadUsers();
				setTimeout(() => (success = ''), 3000);
			} else {
				error = result.error || 'Failed to save user';
			}
		} catch (err) {
			console.error('Error saving user:', err);
			error = 'Failed to save user';
		} finally {
			saving = false;
		}
	}

	async function deleteUser(user: AdminUser) {
		if (user.username === currentUsername) {
			alert('You cannot delete your own account.');
			return;
		}
		if (!confirm(`Delete user "${user.username}"? This cannot be undone.`)) return;

		loading = true;
		try {
			const response = await fetch('/api/admin', {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id: user.id })
			});
			const result = await response.json();
			if (response.ok) {
				await loadUsers();
			} else {
				alert(result.error || 'Failed to delete user');
				loading = false;
			}
		} catch (err) {
			console.error('Error deleting user:', err);
			alert('Failed to delete user');
			loading = false;
		}
	}

	function formatDate(dateString?: string) {
		if (!dateString) return 'Never';
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

{#if editingUser}
	<!-- USER EDITOR -->
	<div class="mx-auto max-w-2xl">
		<div class="mb-4 flex items-center gap-2">
			<Button variant="ghost" size="icon" onclick={cancelEdit}>
				<ArrowLeft class="h-4 w-4" />
			</Button>
			<h2 class="text-lg font-semibold">
				{editingUser.id ? `Edit ${editingUser.username}` : 'New User'}
			</h2>
		</div>

		<Card.Root class="border-0 shadow-sm ring-1 ring-gray-200">
			<Card.Content class="space-y-5 pt-6">
				{#if error}
					<div class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
						{error}
					</div>
				{/if}

				<div class="grid gap-4 md:grid-cols-2">
					<div>
						<Label>Username</Label>
						<Input bind:value={editingUser.username} placeholder="username" class="mt-1" />
					</div>
					<div>
						<Label>Email</Label>
						<Input
							type="email"
							bind:value={editingUser.email}
							placeholder="user@example.com"
							class="mt-1"
						/>
					</div>
				</div>

				<div>
					<Label>Role</Label>
					<Select.Root type="single" bind:value={editingUser.role}>
						<Select.Trigger class="mt-1 w-full capitalize">{editingUser.role}</Select.Trigger>
						<Select.Content>
							<Select.Item value="admin">Admin — full access</Select.Item>
							<Select.Item value="editor">Editor — content management</Select.Item>
						</Select.Content>
					</Select.Root>
				</div>

				<div class="rounded-lg border border-gray-100 bg-gray-50 p-4">
					<div class="mb-3 flex items-center gap-2 text-sm font-medium text-gray-700">
						<KeyRound class="h-4 w-4" />
						{editingUser.id ? 'Reset Password (leave blank to keep current)' : 'Password'}
					</div>
					<div class="grid gap-4 md:grid-cols-2">
						<div>
							<Label>Password</Label>
							<Input
								type="password"
								bind:value={editingUser.password}
								placeholder="At least 8 characters"
								autocomplete="new-password"
								class="mt-1"
							/>
						</div>
						<div>
							<Label>Confirm Password</Label>
							<Input
								type="password"
								bind:value={editingUser.confirmPassword}
								placeholder="Repeat password"
								autocomplete="new-password"
								class="mt-1"
							/>
						</div>
					</div>
				</div>

				<div class="flex justify-end gap-3 border-t pt-4">
					<Button variant="outline" onclick={cancelEdit}>Cancel</Button>
					<Button onclick={saveUser} disabled={saving}>
						{#if saving}Saving...{:else}{editingUser.id ? 'Save Changes' : 'Create User'}{/if}
					</Button>
				</div>
			</Card.Content>
		</Card.Root>
	</div>
{:else}
	<!-- USER LIST -->
	<div class="space-y-4">
		{#if error}
			<div class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-800">
				{error}
			</div>
		{/if}
		{#if success}
			<div class="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-800">
				{success}
			</div>
		{/if}

		<div class="flex items-center justify-between">
			<div>
				<h2 class="text-lg font-medium">Admin Users</h2>
				<p class="text-sm text-gray-500">People who can sign in to this admin panel</p>
			</div>
			<div class="flex gap-2">
				<Button variant="outline" size="icon" onclick={loadUsers}>
					<RefreshCw class="h-4 w-4 {loading ? 'animate-spin' : ''}" />
				</Button>
				<Button onclick={startNewUser}><Plus class="mr-2 h-4 w-4" /> Add User</Button>
			</div>
		</div>

		<Card.Root class="border-0 shadow-sm ring-1 ring-gray-200">
			<Card.Content class="p-0">
				{#if loading}
					<div class="p-12 text-center">Loading...</div>
				{:else if users.length === 0}
					<div class="p-12 text-center text-gray-500">No users found.</div>
				{:else}
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.Head>User</Table.Head>
								<Table.Head>Role</Table.Head>
								<Table.Head>Last Login</Table.Head>
								<Table.Head>Created</Table.Head>
								<Table.Head class="w-[100px]"></Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each users as user (user.id)}
								<Table.Row>
									<Table.Cell>
										<div class="flex flex-col">
											<div class="flex items-center gap-2 font-medium">
												{user.username}
												{#if user.username === currentUsername}
													<Badge variant="secondary" class="text-[10px]">You</Badge>
												{/if}
											</div>
											<span class="text-xs text-gray-500">{user.email}</span>
										</div>
									</Table.Cell>
									<Table.Cell>
										<Badge
											variant={user.role === 'admin' ? 'default' : 'outline'}
											class="gap-1 text-xs capitalize"
										>
											{#if user.role === 'admin'}<ShieldCheck class="h-3 w-3" />{/if}
											{user.role}
										</Badge>
									</Table.Cell>
									<Table.Cell class="text-sm text-gray-500">
										{formatDate(user.last_login)}
									</Table.Cell>
									<Table.Cell class="text-sm text-gray-500">
										{formatDate(user.created_at)}
									</Table.Cell>
									<Table.Cell>
										<Button
											variant="ghost"
											size="icon"
											title="Edit"
											onclick={() => startEditUser(user)}
										>
											<Edit class="h-4 w-4" />
										</Button>
										<Button
											variant="ghost"
											size="icon"
											title={user.username === currentUsername
												? 'You cannot delete yourself'
												: 'Delete'}
											disabled={user.username === currentUsername}
											onclick={() => deleteUser(user)}
										>
											<Trash2 class="h-4 w-4 text-red-500" />
										</Button>
									</Table.Cell>
								</Table.Row>
							{/each}
						</Table.Body>
					</Table.Root>
				{/if}
			</Card.Content>
		</Card.Root>
	</div>
{/if}
