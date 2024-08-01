import { ServerImageHandler } from '@denlukia/plavna-common/server';
import { error } from '@sveltejs/kit';
import { eq, getTableColumns } from 'drizzle-orm';
import type { User as LuciaUser } from 'lucia';
import { db } from '$lib/services/db';

import type { ImageSelect } from '../image/parsers';
import { images } from '../image/schema';
import type { Actor, ImageProviderUpdate } from './parsers';
import { users } from './schema';

export class ActorService {
	private actorObj: LuciaUser | null;

	constructor(actor: LuciaUser | null) {
		this.actorObj = actor;
	}

	async get() {
		return this.actorObj;
	}
	async getOrThrow() {
		const actor = await this.get();
		if (actor === null) error(403);
		return actor;
	}
	async checkOrThrow(id: Actor['id'] | null, username?: Actor['username']) {
		const actor = await this.get();
		if (actor === null) error(403);
		if (id && actor?.id !== id) error(403);
		if (username && actor?.username !== username) error(403);
		return actor;
	}
	async updateImageProvider(providerData: ImageProviderUpdate) {
		const actor = await this.getOrThrow();
		await new ServerImageHandler().setProviderAndUploader(providerData);
		return db.update(users).set(providerData).where(eq(users.id, actor.id));
	}
	async deleteImageProvider() {
		const actor = await this.getOrThrow();
		return db
			.update(users)
			.set({ imagekit_url_endpoint: null, imagekit_public_key: null, imagekit_private_key: null })
			.where(eq(users.id, actor.id));
	}
	async setFromImageIdOrThrow(imageId: ImageSelect['id']) {
		const result = await db
			.select(getTableColumns(users))
			.from(images)
			.where(eq(images.id, imageId))
			.innerJoin(users, eq(users.id, images.user_id))
			.get();
		if (!result) {
			error(403);
		}
		this.actorObj = result;
		return result;
	}
}
