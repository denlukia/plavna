import { dev } from '$app/environment';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '$env/static/private';
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle';
import { GitHub } from 'arctic';
import { Lucia } from 'lucia';

import { sessions, users } from '../collections/db-schema';
import { db } from './db';

import type { User } from '../collections/types';
import type { SupportedLang } from '@denlukia/plavna-common/types';

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
	return new GitHub(GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, { redirectURI });
}

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: User;
	}
}
