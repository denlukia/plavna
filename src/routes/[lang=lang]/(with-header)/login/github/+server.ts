import type { SupportedLang } from '@denlukia/plavna-common/types';
import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { generateState } from 'arctic';
import { getGitHubProvider } from '$lib/services/auth';

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
