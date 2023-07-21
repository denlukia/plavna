import { db } from './db';
import { error } from '@sveltejs/kit';
import { type ExtractTablesWithRelations, and, eq, isNotNull, isNull, or, sql } from 'drizzle-orm';
import { type SQLiteTransaction, alias } from 'drizzle-orm/sqlite-core';
import { superValidateSync } from 'sveltekit-superforms/server';

import { type SupportedLang, defaultLang, isSupportedLang } from '$lib/isomorphic/languages';
import {
	pages,
	posts,
	previewTypes,
	sections,
	tags,
	tagsPosts,
	translations,
	users
} from '$lib/server/domain/db';
import { ERRORS } from '$lib/server/domain/errors';
import {
	postPreviewUpdateSchema,
	postSelectWithoutPreviewValuesSchema,
	postSlugUpdateSchema,
	postUpdateSchema,
	tagDeleteSchema,
	tagUpdateSchema,
	translationInsertSchema,
	translationUpdateSchema
} from '$lib/server/domain/zod';
import { hasNonEmptyProperties, nonNull, removeNullAndDup } from '$lib/server/utils/objects';

import type {
	PageInsert,
	PageSelect,
	PostInsert,
	PostPreviewUpdate,
	PostSelect,
	PostSlugUpdate,
	ReaderPageConfig,
	TagDelete,
	TagUpdate,
	TranslationInsert,
	TranslationUpdate
} from '$lib/server/domain/types';
import type { User } from '../domain/types';
import type { ResultSet } from '@libsql/client';
import type { AuthRequest } from 'lucia';

type TransactionContext = SQLiteTransaction<
	'async',
	ResultSet,
	typeof import('$lib/server/domain/db'),
	ExtractTablesWithRelations<typeof import('$lib/server/domain/db')>
>;

class Plavna {
	private readonly authRequest: AuthRequest;
	private readonly lang: SupportedLang;

	constructor(authRequest: AuthRequest, langParam: string | undefined) {
		this.authRequest = authRequest;
		if (!langParam) {
			this.lang = defaultLang;
		} else if (isSupportedLang(langParam)) {
			this.lang = langParam;
		} else {
			throw error(404);
		}
	}

	private readonly user = {
		get: async () => {
			const session = await this.authRequest.validate();
			return session && session.user;
		},
		getOrThrow: async () => {
			const user = await this.user.get();
			if (user === null) throw error(403);
			return user;
		},
		checkOrThrow: async (id: User['id'] | null, username?: User['username']) => {
			const user = await this.user.get();
			if (user === null) throw error(403);
			if (id && user?.id !== id) throw error(403);
			if (username && user?.username !== username) throw error(403);
			return user;
		}
	};

	public readonly translations = {
		create: async (
			newTranslations: TranslationInsert[],
			mode: 'allow-empty' | 'disallow-empty',
			trx?: TransactionContext,
			user?: User
		) => {
			if (mode === 'disallow-empty') {
				newTranslations.forEach((translation) => {
					if (!hasNonEmptyProperties(translation, ['user_id', '_id'])) {
						throw error(403, ERRORS.AT_LEAST_ONE_TRANSLATION);
					}
				});
			}
			if (user === undefined) {
				user = await this.user.getOrThrow();
			}
			if (user) {
				const userCopy = user;
				newTranslations = newTranslations.map((translation) => ({
					...translation,
					// It only sees that user is not empty via copy and
					// I'm not in the mood for such a plain type guard
					user_id: userCopy.id
				}));
			}
			const dbLocal = trx || db;
			return dbLocal
				.insert(translations)
				.values(newTranslations)
				.returning({ _id: translations._id })
				.all();
		},
		update: async (translation: TranslationUpdate) => {
			const user = await this.user.getOrThrow();
			return db
				.update(translations)
				.set(translation)
				.where(and(eq(translations._id, translation._id), eq(translations.user_id, user.id)))
				.run();
		}
	};

	public readonly tags = {
		create: async (translation: TranslationInsert) => {
			const user = await this.user.getOrThrow();
			return db.transaction(async (trx) => {
				const [{ _id }] = await this.translations.create(
					[translation],
					'disallow-empty',
					trx,
					user
				);
				return trx.insert(tags).values({ name_translation_id: _id, user_id: user.id }).run();
			});
		},
		delete: async (tag: TagDelete) => {
			const user = await this.user.getOrThrow();
			return db
				.delete(tags)
				.where(and(eq(tags.id, tag.id), eq(tags.user_id, user.id)))
				.run();
		},
		switchChecked: async (tag: TagUpdate, slug: string) => {
			const user = await this.user.getOrThrow();
			const currentlyChecked = tag.checked;
			const postSql = sql`${db
				.select({ id: posts.id })
				.from(posts)
				.where(and(eq(posts.slug, slug), eq(posts.user_id, user.id)))}`;
			const tagSql = sql`${db
				.select({ id: tags.id })
				.from(tags)
				.where(and(eq(tags.id, tag.id), eq(tags.user_id, user.id)))}`;

			if (currentlyChecked) {
				const result = await db
					.delete(tagsPosts)
					.where(and(eq(tagsPosts.tag_id, tagSql), eq(tagsPosts.post_id, postSql)))
					.run();
			} else {
				const result = await db
					.insert(tagsPosts)
					.values({ tag_id: tagSql, post_id: postSql })
					.run();
			}
		}
	};

	public readonly pages = {
		create: async (page: PageInsert) => {
			await this.user.checkOrThrow(page.user_id);
			return db.insert(pages).values(page).run();
		},
		edit: async (id: NonNullable<PageInsert['id']>, page: PageInsert) => {
			const user = await this.user.getOrThrow();
			return db
				.update(pages)
				.set(page)
				.where(and(eq(pages.id, id), eq(pages.user_id, user.id)))
				.run();
		},
		delete: async (id: NonNullable<PageInsert['id']>) => {
			const user = await this.user.getOrThrow();
			return db
				.delete(pages)
				.where(and(eq(pages.id, id), eq(pages.user_id, user.id)))
				.run();
		},
		getAllMy: async () => {
			const user = await this.user.getOrThrow();
			return db.select().from(pages).where(eq(pages.user_id, user.id)).all();
		},
		getOneWithSectionsAndPosts: async (
			slug: PageSelect['slug'],
			readerPageConfig?: ReaderPageConfig
		) => {
			// return db.select().from(sections).where(eq(sections.page_id, slug)).get();
		}
	};
	public readonly posts = {
		getIdIfExists: async (slug: PostSelect['slug']) => {
			try {
				const post = await db
					.select({ id: posts.id })
					.from(posts)
					.where(eq(posts.slug, slug))
					.get();
				return post.id;
			} catch (e) {
				return null;
			}
		},
		createFromSlug: async (slug: PostInsert['slug']) => {
			const user = await this.user.getOrThrow();
			return db.transaction(async (trx) => {
				const newTranslation = {
					user_id: user.id
				};
				const [{ _id: title_translation_id }, { _id: content_translation_id }] =
					await this.translations.create(
						[newTranslation, newTranslation],
						'allow-empty',
						trx,
						user
					);
				const post = await trx
					.insert(posts)
					.values({
						user_id: user.id,
						slug: slug,
						title_translation_id: Number(title_translation_id),
						content_translation_id: Number(content_translation_id)
					})
					.returning({ id: posts.id })
					.get();
				return post.id;
			});
		},
		createAndOrLoadEditor: async (username: User['username'], slug: PostSelect['slug']) => {
			const user = await this.user.checkOrThrow(null, username);

			let exisingId = await this.posts.getIdIfExists(slug);
			if (exisingId === null) {
				exisingId = await this.posts.createFromSlug(slug);
			}

			const translForForms = alias(translations, 'translForForms');
			const query = await db
				.select({
					posts,
					tagsPosts,
					tags,
					translations: { _id: translations._id, [this.lang]: translations[this.lang] },
					translForForms,
					previewTypes
				})
				.from(posts)
				.leftJoin(previewTypes, or(eq(previewTypes.user_id, user.id), isNull(previewTypes.user_id)))
				.leftJoin(tags, eq(tags.user_id, user.id))
				.leftJoin(translations, eq(translations._id, previewTypes.name_translation_id))
				.leftJoin(
					translForForms,
					or(
						eq(translForForms._id, posts.content_translation_id),
						eq(translForForms._id, posts.title_translation_id),
						eq(translForForms._id, tags.name_translation_id)
					)
				)
				.leftJoin(tagsPosts, eq(tagsPosts.post_id, exisingId))
				.where(eq(posts.id, exisingId))
				.all();

			const previewsArr = query.map((rows) => rows.previewTypes).filter(removeNullAndDup('id'));
			const allTags = query.map((rows) => rows.tags).filter(removeNullAndDup('id'));
			const postTags = query.map((rows) => rows.tagsPosts).filter(removeNullAndDup('tag_id'));
			const translArr = query.map((rows) => rows.translations).filter(removeNullAndDup('_id'));
			const translForms = query.map(({ translForForms: t }) => t).filter(removeNullAndDup('_id'));
			const tagForms = allTags.map((tag) => ({
				isCheckedForm: superValidateSync(
					{ ...tag, checked: !!postTags.find((t) => t.tag_id === tag.id) },
					tagUpdateSchema
				),
				name_translation_id: tag.name_translation_id,
				deletionForm: superValidateSync({ id: tag.id }, tagDeleteSchema)
			}));

			return {
				post: postSelectWithoutPreviewValuesSchema.parse(query[0].posts),
				postSlugForm: superValidateSync(query[0].posts, postSlugUpdateSchema),
				postForm: superValidateSync(query[0].posts, postUpdateSchema),
				postPreviewForm: superValidateSync(query[0].posts, postPreviewUpdateSchema),
				previews: previewsArr,
				tagForms,
				tagCreationForm: superValidateSync(translationInsertSchema),
				translations: Object.fromEntries([
					...translForms.map((translation) => {
						const { _id, ...other } = translation;
						return [_id, superValidateSync(other, translationUpdateSchema)];
					}),
					...translArr.map((translation) => [translation._id, translation[this.lang]])
				])
			};
		},
		updateSlug: async (slug: string, post: PostSlugUpdate) => {
			const user = await this.user.getOrThrow();
			return db
				.update(posts)
				.set(post)
				.where(and(eq(posts.slug, slug), eq(posts.user_id, user.id)))
				.returning({ slug: posts.slug })
				.get();
		},
		publish: async (slug: string) => {
			const user = await this.user.getOrThrow();
			return db
				.update(posts)
				.set({ published_at: new Date() })
				.where(and(eq(posts.slug, slug), eq(posts.user_id, user.id)))
				.returning({ slug: posts.slug })
				.get();
		},
		hide: async (slug: string) => {
			const user = await this.user.getOrThrow();
			return db
				.update(posts)
				.set({ published_at: null })
				.where(and(eq(posts.slug, slug), eq(posts.user_id, user.id)))
				.returning({ slug: posts.slug })
				.get();
		},
		delete: async (slug: string) => {
			const user = await this.user.getOrThrow();
			return db
				.delete(posts)
				.where(and(eq(posts.slug, slug), eq(posts.user_id, user.id)))
				.run();
		},
		updatePreview: async (slug: string, preview: PostPreviewUpdate) => {
			const user = await this.user.getOrThrow();
			return db
				.update(posts)
				.set(preview)
				.where(and(eq(posts.slug, slug), eq(posts.user_id, user.id)))
				.returning({ slug: posts.slug })
				.get();
		},
		load: async (username: string, slug: string) => {
			const userPromise = this.user.get();
			const queryPromise = db
				.select({
					posts,
					translations: { _id: translations._id, [this.lang]: translations[this.lang] },
					previewTypes,
					tags
				})
				.from(posts)
				.innerJoin(users, eq(users.id, posts.user_id))
				.leftJoin(previewTypes, eq(previewTypes.id, posts.preview_type_id))
				.leftJoin(tagsPosts, eq(tagsPosts.post_id, posts.id))
				.leftJoin(tags, eq(tags.id, tagsPosts.tag_id))
				.leftJoin(
					translations,
					or(
						eq(translations._id, posts.title_translation_id),
						eq(translations._id, posts.content_translation_id),
						eq(translations._id, tags.name_translation_id)
					)
				)
				.where(and(eq(users.username, username), eq(posts.slug, slug)))
				.all();

			const [query, user] = await Promise.all([queryPromise, userPromise]);

			if (!query.length) {
				throw error(404);
			}
			if (!user && query[0].posts.published_at === null) {
				throw error(404);
			}
			return {
				post: query[0].posts,
				previewType: query[0].previewTypes,
				translations: Object.fromEntries(
					query
						.map((rows) => rows.translations)
						.filter(removeNullAndDup('_id'))
						.map((rows) => [rows._id, rows[this.lang]])
				),
				tags: query.map((rows) => rows.tags).filter(removeNullAndDup('id'))
			};
		}
	};
}
export default Plavna;

export type PlavnaService = typeof Plavna;
