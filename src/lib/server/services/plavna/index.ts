import { error } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';

import { pages, sections } from '$lib/server/schemas/db';

import type { PageInsert, ReaderPageConfig } from '$lib/server/schemas/types';
import type { Database } from '../db';
import type { AuthRequest } from 'lucia-auth';

class Plavna {
	private readonly db: Database;
	private readonly auth: AuthRequest;

	constructor(db: Database, auth: AuthRequest) {
		this.db = db;
		this.auth = auth;
	}

	private readonly user = {
		get: async () => {
			return (await this.auth.validateUser()).user;
		},
		getOrThrow: async () => {
			const user = await this.user.get();
			if (user === null) throw error(403);
			return user;
		},
		checkOrThrow: async (id: string) => {
			const user = await this.user.get();
			if (user?.id !== id) throw error(403);
		}
	};

	public readonly pages = {
		create: async (page: PageInsert) => {
			await this.user.checkOrThrow(page.user_id);
			return this.db.insert(pages).values(page).run();
		},
		edit: async (id: NonNullable<PageInsert['id']>, page: PageInsert) => {
			const user = await this.user.getOrThrow();
			return this.db
				.update(pages)
				.set(page)
				.where(and(eq(pages.id, id), eq(pages.user_id, user.id)))
				.run();
		},
		delete: async (id: NonNullable<PageInsert['id']>) => {
			const user = await this.user.getOrThrow();
			return this.db
				.delete(pages)
				.where(and(eq(pages.id, id), eq(pages.user_id, user.id)))
				.run();
		},
		getAllMy: async () => {
			const user = await this.user.getOrThrow();
			return this.db.select().from(pages).where(eq(pages.user_id, user.id)).all();
		},
		getOneWithSectionsAndPosts: async (
			slug: PageInsert['slug'],
			readerPageConfig?: ReaderPageConfig
		) => {
			return this.db.select().from(sections).where(eq(sections.page_id, slug)).get();
		}
	};
}
export default Plavna;
