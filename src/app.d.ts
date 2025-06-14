// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}

	namespace NodeJS {
		interface ProcessEnv {
			SESSION_SECRET: string;
			ADMIN_USERNAME: string;
			ADMIN_PASSWORD: string;
		}
	}
}

export {};
