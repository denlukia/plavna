import { dev } from '$app/environment';
import { libsqlClient } from './db';
import { libsql } from '@lucia-auth/adapter-sqlite';
import { lucia } from 'lucia';
import { sveltekit } from 'lucia/middleware';

export const auth = lucia({
	adapter: libsql(libsqlClient, {
		user: 'auth_user',
		key: 'auth_key',
		session: 'auth_session'
	}),
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),
	getUserAttributes: (data) => {
		return { id: data.id, username: data.username, uploadcare_token: data.uploadcare_token };
	}
});
