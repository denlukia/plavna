import type { SupportedLang } from '@denlukia/plavna-common/types';
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle';
import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import { PUBLIC_VERCEL_URL } from '$env/static/public';
import { GitHub } from 'arctic';
import { Lucia } from 'lucia';
import type { Actor } from '$lib/features/user/parsers';
import { sessions, users } from '$lib/features/user/schema';

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
	const protocol = dev ? `http://` : `https://`;
	const redirectURI = `${protocol}${PUBLIC_VERCEL_URL}/api/github-callback/${lang}`;
	return new GitHub(env.GITHUB_CLIENT_ID, env.GITHUB_CLIENT_SECRET, { redirectURI });
}

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: Actor;
	}
}
