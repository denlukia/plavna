import { dev } from '$app/environment';
import { redirect } from '@sveltejs/kit';
import { generateState } from 'arctic';

import { github } from '$lib/server/services/auth';

import type { RequestEvent } from '@sveltejs/kit';

export async function GET(event: RequestEvent): Promise<Response> {
	const state = generateState();
	const url = await github.createAuthorizationURL(state);

	event.cookies.set('github_oauth_state', state, {
		path: '/',
		secure: !dev,
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: 'lax'
	});

	redirect(302, url.toString());
}
