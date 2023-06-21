import { error, redirect } from '@sveltejs/kit';

import type { SupportedLang } from '$lib/client-server/languages';

export async function getUserOrThrow(locals: App.Locals, params: any) {
	const { user } = await locals.auth.validateUser();
	if (!user) throw redirect(302, '/plavna/login');
	if (user.username !== params.username) throw error(403);
	return user;
}
