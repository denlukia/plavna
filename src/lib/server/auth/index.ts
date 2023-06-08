import lucia from 'lucia-auth';
import { sveltekit } from 'lucia-auth/middleware';
import { specificAdapter } from './adapter';
import { dev } from '$app/environment';
import { db } from '../db';

export type User = { id: string; username: string };
export type PossiblyUser = User | null;

export const auth = lucia({
	adapter: specificAdapter(db),
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),
	transformDatabaseUser: (userData): User => {
		return {
			id: userData.id,
			username: userData.username
		};
	}
});

export type Auth = typeof auth;
