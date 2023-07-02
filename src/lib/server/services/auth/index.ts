import { dev } from '$app/environment';
import { db } from '../db';
import { specificAdapter } from './adapter';
import lucia from 'lucia-auth';
import { sveltekit } from 'lucia-auth/middleware';

import type { User } from '$lib/server/schemas/types';

export const auth = lucia({
	adapter: specificAdapter(db),
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),
	transformDatabaseUser: (user): User => {
		return { id: user.id, username: user.username, uploadcare_token: user.uploadcare_token };
	}
});
