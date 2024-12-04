import { type RequestEvent } from '@sveltejs/kit';
import { OAuth2RequestError } from 'arctic';
import { eq } from 'drizzle-orm';
import { generateId } from 'lucia';
import { generatePath } from '$lib/features/common/links';
import { getLang } from '$lib/features/i18n/utils';
import { table_users } from '$lib/features/user/schema';
import { getGitHubProvider, lucia } from '$lib/services/auth';
import { db } from '$lib/services/db';

import { CLOSED_GREETINGS_COOKIE_NAME } from '../../../[[lang=lang]]/[username]/settings/config';

export async function GET(event: RequestEvent): Promise<Response> {
	const code = event.url.searchParams.get('code');
	const state = event.url.searchParams.get('state');
	const storedState = event.cookies.get('github_oauth_state') ?? null;

	if (!code || !state || !storedState || state !== storedState) {
		return new Response(null, {
			status: 400
		});
	}

	try {
		const tokens = await getGitHubProvider(getLang(event.params.lang)).validateAuthorizationCode(
			code
		);
		const githubUserResponse = await fetch('https://api.github.com/user', {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`
			}
		});
		const githubUser: GitHubUser = await githubUserResponse.json();

		const existingUser = await db
			.select()
			.from(table_users)
			.where(eq(table_users.github_id, githubUser.id))
			.get();

		const githubUsername = githubUser.login;

		if (existingUser) {
			const session = await lucia.createSession(existingUser.id, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		} else {
			const userId = generateId(15);

			await db.insert(table_users).values({
				id: userId,
				github_id: githubUser.id,
				username: githubUsername
			});

			const session = await lucia.createSession(userId, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			event.cookies.set(sessionCookie.name, sessionCookie.value, {
				path: '.',
				...sessionCookie.attributes
			});
		}

		const redirectPathTemplate = event.cookies.get(CLOSED_GREETINGS_COOKIE_NAME)
			? '/[lang]/[username]/pages'
			: '/[lang]/[username]/settings';
		const redirectUsername = existingUser?.username || githubUsername;
		const redirectLocation = generatePath(redirectPathTemplate, event.params, {
			username: redirectUsername
		});

		return new Response(null, {
			status: 302,
			headers: {
				Location: redirectLocation
			}
		});
	} catch (e) {
		// the specific error message depends on the provider
		if (e instanceof OAuth2RequestError) {
			// invalid code
			return new Response(null, {
				status: 400
			});
		}
		return new Response(null, {
			status: 500
		});
	}
}

interface GitHubUser {
	id: number;
	login: string;
}
