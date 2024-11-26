import type { SupportedLang } from '@denlukia/plavna-common/types';
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle';
import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import { PUBLIC_HOST } from '$env/static/public';
import { GitHub } from 'arctic';
import { Lucia } from 'lucia';
import { table_sessions, table_users } from '$lib/features/user/schema';
import type { Actor } from '$lib/features/user/validators';

import { db } from './db';

const adapter = new DrizzleSQLiteAdapter(db, table_sessions, table_users);

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
	const redirectURI = `${protocol}${PUBLIC_HOST}/api/github-callback/${lang}`;
	return new GitHub(env.GITHUB_CLIENT_ID, env.GITHUB_CLIENT_SECRET, { redirectURI });
}

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: Actor;
	}
}
