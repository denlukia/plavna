import { db } from '../db';
import { error } from '@sveltejs/kit';
import { and, eq, isNull, or, sql } from 'drizzle-orm';
import { alias } from 'drizzle-orm/sqlite-core';
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
} from '$lib/server/schemas/db';
import {
	postPreviewValuesUpdateSchema,
	postUpdateSchema,
	tagDeleteSchema,
	tagUpdateSchema,
	translationInsertSchema,
	translationUpdateSchema
} from '$lib/server/schemas/zod';
import { nonNull, removeDupesByField } from '$lib/server/utils/objects';

import type {
	PageInsert,
	PageSelect,
	PostInsert,
	PostSelect,
	PostUpdate,
	ReaderPageConfig,
	TagDelete,
	TagUpdate,
	TranslationInsert,
	TranslationUpdate
} from '$lib/server/schemas/types';
import type { User } from '../../schemas/types';
import type { AuthRequest } from 'lucia-auth';

class Plavna {
	private readonly auth: AuthRequest;
	private readonly lang: SupportedLang;

	constructor(auth: AuthRequest, langParam: string | undefined) {
		this.auth = auth;
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
			return (await this.auth.validateUser()).user;
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
				const { _id } = await trx
					.insert(translations)
					.values({ ...translation, user_id: user.id })
					.returning({ _id: translations._id })
					.get();

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
				console.log('delete result', result);
			} else {
				const result = await db
					.insert(tagsPosts)
					.values({ tag_id: tagSql, post_id: postSql })
					.run();
				console.log('insert result', result);
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
				const [{ _id: title_translation_id }, { _id: content_translation_id }] = await trx
					.insert(translations)
					.values([newTranslation, newTranslation])
					.returning({ _id: translations._id })
					.all();
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
		createAndOrLoadEditingForms: async (username: User['username'], slug: PostSelect['slug']) => {
			const user = await this.user.checkOrThrow(null, username);

			let exisingId = await this.posts.getIdIfExists(slug);
			if (exisingId === null) {
				exisingId = await this.posts.createFromSlug(slug);
			}

			const titleTranslations = alias(translations, 'titleTranslations');
			const contentTranslations = alias(translations, 'contentTranslations');
			const tagsTranslations = alias(translations, 'tagsTranslations');

			const query = await db
				.select({
					posts,
					titleTranslations,
					contentTranslations,
					tagsPosts,
					tags,
					tagsTranslations,
					previewTypes
				})

				.from(posts)
				.innerJoin(titleTranslations, eq(titleTranslations._id, posts.title_translation_id))
				.innerJoin(contentTranslations, eq(contentTranslations._id, posts.content_translation_id))
				.leftJoin(previewTypes, or(eq(previewTypes.user_id, user.id), isNull(previewTypes.user_id)))
				.leftJoin(tags, eq(tags.user_id, user.id))
				.leftJoin(tagsTranslations, eq(tagsTranslations._id, tags.name_translation_id))
				.leftJoin(tagsPosts, eq(tagsPosts.post_id, exisingId))
				.where(eq(posts.id, exisingId))
				.all();

			const postObj = query[0].posts;
			const titleTranslationObj = query[0].titleTranslations;
			const contentTranslationObj = query[0].contentTranslations;
			const previewsArr = query
				.map((rows) => rows.previewTypes)
				.filter(nonNull)
				.filter(removeDupesByField('id'));

			const allTags = query
				.map((rows) => rows.tags)
				.filter(nonNull)
				.filter(removeDupesByField('id'));
			const postTags = query
				.map((rows) => rows.tagsPosts)
				.filter(nonNull)
				.filter(removeDupesByField('tag_id'));
			const allTagsTranslations = query
				.map((rows) => rows.tagsTranslations)
				.filter(nonNull)
				.filter(removeDupesByField('_id'));

			const tagForms = allTags.map((tag) => ({
				isCheckedForm: superValidateSync(
					{ ...tag, checked: !!postTags.find((t) => t.tag_id === tag.id) },
					tagUpdateSchema
				),
				nameForm: superValidateSync(
					{
						_id: tag.name_translation_id,
						...allTagsTranslations.find((t) => t._id === tag.name_translation_id)
					},
					translationUpdateSchema,
					{ id: String(tag.name_translation_id) }
				),
				deletionForm: superValidateSync({ id: tag.id }, tagDeleteSchema)
			}));

			return {
				postForm: superValidateSync(postObj, postUpdateSchema),
				titleForm: superValidateSync(titleTranslationObj, translationUpdateSchema, {
					id: String(titleTranslationObj._id)
				}),
				contentForm: superValidateSync(contentTranslationObj, translationUpdateSchema, {
					id: String(contentTranslationObj._id)
				}),
				previews: previewsArr,
				currentPreviewId: postObj.preview_type_id,
				currentPreviewValues: postPreviewValuesUpdateSchema.parse(postObj),
				tagForms,
				tagCreationForm: superValidateSync(translationInsertSchema)
			};
		},
		save: async (post: PostUpdate) => {
			const user = await this.user.getOrThrow();
			return db
				.update(posts)
				.set(post)
				.where(and(eq(posts.id, post.id), eq(posts.user_id, user.id)))
				.returning({ slug: posts.slug })
				.get();
		},
		publish: async (post: PostUpdate) => {
			const user = await this.user.getOrThrow();
			return db
				.update(posts)
				.set({ ...post, published_at: new Date() })
				.where(and(eq(posts.id, post.id), eq(posts.user_id, user.id)))
				.returning({ slug: posts.slug })
				.get();
		},
		hide: async (post: PostUpdate) => {
			const user = await this.user.getOrThrow();
			return db
				.update(posts)
				.set({ ...post, published_at: null })
				.where(and(eq(posts.id, post.id), eq(posts.user_id, user.id)))
				.returning({ slug: posts.slug })
				.get();
		},
		delete: async (post: PostUpdate) => {
			const user = await this.user.getOrThrow();
			return db
				.delete(posts)
				.where(and(eq(posts.id, post.id), eq(posts.user_id, user.id)))
				.run();
		}
	};
}
export default Plavna;

export type PlavnaService = typeof Plavna;
