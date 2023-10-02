import { dev } from '$app/environment';
import { libsql } from '@lucia-auth/adapter-sqlite';
import { lucia } from 'lucia';
import { sveltekit } from 'lucia/middleware';

import { libsqlClient } from './db';

import type { User } from '../collections/types';

export const auth = lucia({
	adapter: libsql(libsqlClient, {
		user: 'auth_user',
		key: 'auth_key',
		session: 'auth_session'
	}),
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),
	getUserAttributes: (data: User) => {
		return {
			id: data.id,
			username: data.username,
			imagekit_public_key: data.imagekit_public_key,
			imagekit_private_key: data.imagekit_private_key,
			imagekit_url_endpoint: data.imagekit_url_endpoint
		};
	}
});
