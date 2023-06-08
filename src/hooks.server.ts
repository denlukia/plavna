// hooks.server.ts
import { auth, type PossiblyUser } from '$lib/server/auth';
import { redirect, type Handle, error } from '@sveltejs/kit';

const userCheckRequired = [
	'/[[lang=lang]]/[username]/pages',
	'/[[lang=lang]]/[username]/[post]/edit',
	'/[[lang=lang]]/[username]/page-[pagename]/[post]/edit'
];

export const handle: Handle = async ({ event, resolve }) => {
	const authRequest = auth.handleRequest(event);

	if (event.route.id && userCheckRequired.includes(event.route.id)) {
		const { user }: { user: PossiblyUser } = await authRequest.validateUser();
		if (!user) throw redirect(302, '/plavna/login');
		if (user.username !== event.params.username) throw error(403);
	}

	event.locals.auth = authRequest;
	return await resolve(event);
};
