import { dev } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import { generateState } from 'arctic';

import { getGitHubProvider } from '$lib/server/services/auth';

import type { SupportedLang } from '@denlukia/plavna-common/types';
import type { RequestEvent } from '@sveltejs/kit';

export async function GET(event: RequestEvent): Promise<Response> {
	const state = generateState();
	const url = await getGitHubProvider(event.params.lang as SupportedLang).createAuthorizationURL(
		state
	);

	event.cookies.set('github_oauth_state', state, {
		path: '/',
		secure: !dev,
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: 'lax'
	});

	redirect(302, url.toString());
}
