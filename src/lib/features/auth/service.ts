import { ServerImageHandler } from '@denlukia/plavna-common/server';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { User as LuciaUser } from 'lucia';
import { db } from '$lib/services/db';

import type { ImageProviderUpdate, User } from './parsers';
import { users } from './schema';

export class UserService {
	private userObj: LuciaUser | null;

	constructor(user: LuciaUser | null) {
		this.userObj = user;
	}

	async get() {
		return this.userObj;
	}
	async getOrThrow() {
		const user = await this.get();
		if (user === null) error(403);
		return user;
	}
	async checkOrThrow(id: User['id'] | null, username?: User['username']) {
		const user = await this.get();
		if (user === null) error(403);
		if (id && user?.id !== id) error(403);
		if (username && user?.username !== username) error(403);
		return user;
	}
	async updateImageProvider(providerData: ImageProviderUpdate) {
		const user = await this.getOrThrow();
		await new ServerImageHandler().setProviderAndUploader(providerData);
		return db.update(users).set(providerData).where(eq(users.id, user.id));
	}
}
