import { ServerImageHandler } from '@denlukia/plavna-common/images';
import { error } from '@sveltejs/kit';
import { eq, getTableColumns } from 'drizzle-orm';
import type { User as LuciaUser } from 'lucia';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { IMAGE_CREDENTIALS_PATH } from '$lib/collections/config';
import { db } from '$lib/services/db';

import type { ImageSelect } from '../image/parsers';
import { images } from '../image/schema';
import {
	userSettingsFormSchema,
	type Actor,
	type ImageProviderUpdate,
	type UserSettingsUpdate
} from './parsers';
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
		const imageHandler = new ServerImageHandler();
		await imageHandler.setProviderAndUploader(providerData, IMAGE_CREDENTIALS_PATH);
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
	async getSettingsForm(username: Actor['username']) {
		await this.checkOrThrow(null, username);
		const actor = await db
			.select({
				username: users.username
			})
			.from(users)
			.where(eq(users.username, username))
			.get();
		if (!actor) error(404);

		const superValidated = await superValidate(actor, zod(userSettingsFormSchema), {
			id: 'user-settings'
		});

		return superValidated;
	}
	async updateSettings(data: UserSettingsUpdate) {
		const actor = await this.getOrThrow();

		// TODO: Only write allowed fields (and across all project)
		return db.update(users).set(data).where(eq(users.id, actor.id)).returning().get();
	}
}
