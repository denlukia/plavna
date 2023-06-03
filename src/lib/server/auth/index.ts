import lucia from 'lucia-auth';
import { sveltekit } from 'lucia-auth/middleware';
import { specificAdapter } from './adapter';
import { dev } from '$app/environment';
import { db } from '../db';

export type AuthUser = { userId: string; username: string };
export type PossiblyUser = AuthUser | null;

export const auth = lucia({
	adapter: specificAdapter(db),
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),
	transformDatabaseUser: (userData): AuthUser => {
		return {
			userId: userData.id,
			username: userData.username
		};
	}
});

export type Auth = typeof auth;
