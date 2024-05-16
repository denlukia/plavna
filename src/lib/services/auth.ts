import type { SupportedLang } from '@denlukia/plavna-common/types';
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle';
import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import { GitHub } from 'arctic';
import { Lucia } from 'lucia';
import type { User } from '$lib/features/auth/parsers';
import { sessions, users } from '$lib/features/auth/schema';

import { db } from './db';

const adapter = new DrizzleSQLiteAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: !dev
		}
	},
	getUserAttributes: (attributes) => {
		return {
			...attributes
		};
	}
});

export function getGitHubProvider(lang: SupportedLang) {
	const base = dev ? `http://localhost:5173` : `https://plvn.app`;
	const redirectURI = `${base}/api/github-callback/${lang}`;
	return new GitHub(env.GITHUB_CLIENT_ID, env.GITHUB_CLIENT_SECRET, { redirectURI });
}

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: User;
	}
}
