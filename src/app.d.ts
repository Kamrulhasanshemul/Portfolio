// Add user to locals
declare global {
	namespace App {
		interface Locals {
			user?: { username: string } | null;
		}
	}
}

export {};
