import { page } from '$app/stores';
import { POSTS_PER_SECTION, SECTIONS_PER_LOAD } from '../domain/constants';
import { db } from './db';
import { error } from '@sveltejs/kit';
import {
	type ExtractTablesWithRelations,
	and,
	desc,
	eq,
	exists,
	gte,
	inArray,
	isNotNull,
	isNull,
	lt,
	lte,
	notExists,
	or,
	sql
} from 'drizzle-orm';
import { type SQLiteTransaction, alias } from 'drizzle-orm/sqlite-core';
import { marked } from 'marked';
import { superValidateSync } from 'sveltekit-superforms/server';

import {
	type SupportedLang,
	defaultLang,
	isSupportedLang,
	supportedLanguages
} from '$lib/isomorphic/languages';
import { findTagIdsInLinks } from '$lib/isomorphic/utils';
import {
	pages,
	posts,
	previewTypes,
	sections,
	sectionsTags,
	tags,
	tagsPosts,
	translations,
	users
} from '$lib/server/domain/db';
import { ERRORS } from '$lib/server/domain/errors';
import {
	pageCreateFormSchema,
	pageSelectSchema,
	pageUpdateFormSchema,
	postPreviewUpdateSchema,
	postSelectWithoutPreviewValuesSchema,
	postSlugUpdateSchema,
	postUpdateSchema,
	sectionInsertSchema,
	tagDeleteSchema,
	tagUpdateSchema,
	translationInsertSchema,
	translationUpdateSchema
} from '$lib/server/domain/parsers';
import {
	removeNullAndDup as getNullAndDupFilter,
	hasNonEmptyProperties,
	nonNull
} from '$lib/server/utils/objects';

import type {
	ExcludedTags,
	PageCreateForm,
	PageInsert,
	PageSelect,
	PageUpdateForm,
	PostInsert,
	PostPreviewUpdate,
	PostSelect,
	PostSlugUpdate,
	PreviewTypeSelect,
	SectionDelete,
	SectionSelect,
	SectionTagInsert,
	SectionUpdate,
	TagDelete,
	TagPostSelect,
	TagSelect,
	TagUpdate,
	TranslationDelete,
	TranslationInsert,
	TranslationSelect,
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

	public readonly pages = {
		create: async (page: PageCreateForm) => {
			const user = await this.user.getOrThrow();
			return db
				.insert(pages)
				.values({ ...page, user_id: user.id })
				.run();
		},
		update: async (page: PageUpdateForm) => {
			const user = await this.user.getOrThrow();
			return db
				.update(pages)
				.set(page)
				.where(and(eq(pages.id, page.id), eq(pages.user_id, user.id)))
				.run();
		},
		delete: async (id: PageSelect['id']) => {
			const user = await this.user.getOrThrow();
			return db
				.delete(pages)
				.where(and(eq(pages.id, id), eq(pages.user_id, user.id)))
				.run();
		},
		getMyAsForms: async (username: string) => {
			const user = await this.user.checkOrThrow(null, username);
			const query = await db.select().from(pages).where(eq(pages.user_id, user.id)).all();

			return {
				editForms: query.map((page) =>
					superValidateSync(page, pageUpdateFormSchema, { id: 'pages-' + page.id })
				),
				createForm: superValidateSync(pageCreateFormSchema)
			};
		},
		getOneWithSectionsAndPosts: async (
			username: string,
			pagename: string,
			excludedTags?: ExcludedTags
		) => {
			const sectionsPromises = new Array(SECTIONS_PER_LOAD).fill(null).map((_, index) => {
				// TODO Currently I see no way of DRYing with keeping good types

				// 1. Sections query
				const userIdSq = db
					.select({ id: users.id })
					.from(users)
					.where(eq(users.username, username));
				const pageIdSq = db
					.select()
					.from(pages)
					.where(and(eq(pages.slug, pagename), eq(pages.user_id, userIdSq)))
					.as('page_sq');

				const {
					$inferInsert: $inferInsertSections,
					$inferSelect: $inferSelectSections,
					_: sectionsMeta,
					...sectionsFields
				} = sections;
				const sectionQueryForPosts = db
					.select({ ...sectionsFields })
					.from(pageIdSq)
					.innerJoin(sections, eq(sections.page_id, pageIdSq.id))
					.innerJoin(translations, eq(translations._id, sections.title_translation_id))
					.where(isNotNull(translations[this.lang]))
					.limit(SECTIONS_PER_LOAD)
					.offset(index);
				const sectionQueryForTranslatins = db
					.select({ id: sections.title_translation_id })
					.from(pageIdSq)
					.innerJoin(sections, eq(sections.page_id, pageIdSq.id))
					.innerJoin(translations, eq(translations._id, sections.title_translation_id))
					.where(isNotNull(translations[this.lang]))
					.limit(SECTIONS_PER_LOAD)
					.offset(index);
				const sectionQueryAliased = sectionQueryForPosts.as('section_sq');

				// 2. Posts query
				const {
					$inferInsert: $inferInsertPosts,
					$inferSelect: $inferSelectPosts,
					_: postsMeta,
					...postsFields
				} = posts;
				const translationForTag = alias(translations, 'translation_for_tag');
				const translationForPost = alias(translations, 'translation_for_post');
				const postsQuery = db
					.select({ ...postsFields })
					.from(sectionQueryAliased)
					.innerJoin(
						sectionsTags,
						and(
							eq(sectionsTags.section_id, sectionQueryAliased.id),
							eq(sectionsTags.lang, this.lang)
						)
					)
					.innerJoin(tags, eq(tags.id, sectionsTags.tag_id))
					.innerJoin(tagsPosts, eq(tagsPosts.tag_id, tags.id))
					.innerJoin(posts, eq(posts.id, tagsPosts.post_id))
					.innerJoin(
						translationForTag,
						and(
							eq(translationForTag._id, tags.name_translation_id),
							isNotNull(translationForTag[this.lang])
						)
					)
					.innerJoin(
						translationForPost,
						and(
							eq(translationForPost._id, posts.title_translation_id),
							isNotNull(translationForPost[this.lang])
						)
					)
					.where(isNotNull(posts.published_at))
					.orderBy(desc(posts.published_at))
					.groupBy(posts.id)
					.limit(POSTS_PER_SECTION);
				const postsQueryForTranslations = db
					.select({ id: posts.title_translation_id })
					.from(sectionQueryAliased)
					.innerJoin(
						sectionsTags,
						and(
							eq(sectionsTags.section_id, sectionQueryAliased.id),
							eq(sectionsTags.lang, this.lang)
						)
					)
					.innerJoin(tags, eq(tags.id, sectionsTags.tag_id))
					.innerJoin(tagsPosts, eq(tagsPosts.tag_id, tags.id))
					.innerJoin(posts, eq(posts.id, tagsPosts.post_id))
					.innerJoin(
						translationForTag,
						and(
							eq(translationForTag._id, tags.name_translation_id),
							isNotNull(translationForTag[this.lang])
						)
					)
					.innerJoin(
						translationForPost,
						and(
							eq(translationForPost._id, posts.title_translation_id),
							isNotNull(translationForPost[this.lang])
						)
					)
					.where(isNotNull(posts.published_at))
					.orderBy(desc(posts.published_at))
					.groupBy(posts.id)
					.limit(POSTS_PER_SECTION);
				const postsQueryAliased = postsQuery.as('posts_sq');

				// 3. Tags posts query
				const tagsPostsQuery = db
					.select({ tag_id: tagsPosts.tag_id, post_id: tagsPosts.post_id })
					.from(postsQueryAliased)
					.innerJoin(tagsPosts, eq(tagsPosts.post_id, postsQueryAliased.id))
					.innerJoin(tags, eq(tags.id, tagsPosts.tag_id))
					.innerJoin(
						translations,
						and(eq(translations._id, tags.name_translation_id), isNotNull(translations[this.lang]))
					);
				const tagsPostsQueryForTranslations = db
					.select({ id: tags.name_translation_id })
					.from(postsQueryAliased)
					.innerJoin(tagsPosts, eq(tagsPosts.post_id, postsQueryAliased.id))
					.innerJoin(tags, eq(tags.id, tagsPosts.tag_id))
					.innerJoin(
						translations,
						and(eq(translations._id, tags.name_translation_id), isNotNull(translations[this.lang]))
					);
				const tagsPostsQueryAliased = tagsPostsQuery.as('tags_posts_sq');

				// 4. Tags
				const {
					$inferInsert: $inferInsertTags,
					$inferSelect: $inferSelectTags,
					_: tagsMeta,
					...tagsFields
				} = tags;
				const tagsQuery = db
					.select({ ...tagsFields })
					.from(tagsPostsQueryAliased)
					.innerJoin(tags, eq(tags.id, tagsPostsQueryAliased.tag_id))
					.groupBy(tags.id);

				// 5. Translations query
				const allTranslationsQuery = db
					.select({ _id: translations._id, [this.lang]: translations[this.lang] })
					.from(translations)
					.where(
						or(
							inArray(translations._id, sectionQueryForTranslatins),
							inArray(translations._id, postsQueryForTranslations),
							inArray(translations._id, tagsPostsQueryForTranslations)
						)
					)
					.groupBy(translations._id);

				// 6. Preview types query
				const allPreviewTypesQuery = db
					.select({ id: previewTypes.id, component_reference: previewTypes.component_reference })
					.from(postsQueryAliased)
					.innerJoin(previewTypes, eq(previewTypes.id, postsQueryAliased.preview_type_id))
					.groupBy(previewTypes.id);

				const sectionInfo = sectionQueryForPosts.all();
				const postsInfo = postsQuery.all();
				const tagsPostsInfo = tagsPostsQuery.all();
				const tagsInfo = tagsQuery.all();
				const translationsInfo = allTranslationsQuery.all();
				const previewTypesInfo = allPreviewTypesQuery.all();

				return Promise.all([
					sectionInfo,
					postsInfo,
					tagsPostsInfo,
					tagsInfo,
					translationsInfo,
					previewTypesInfo
				]);
			});
			const sectionsResponses = await Promise.all(sectionsPromises);
			const sectionsNonEmpty = sectionsResponses.filter((res) => res[0].length);

			return {
				sections: sectionsNonEmpty.map(([sectionInfo, postsInfo, tagsPostsInfo]) => {
					return { section: sectionInfo[0], posts: postsInfo, tagsPosts: tagsPostsInfo };
				}),
				// TODO Make sure we're not loading sections or posts or tags without translation
				// TODO Transform section translations into forms
				tags: sectionsNonEmpty.reduce((acc, [a, b, c, tagsInfo]) => {
					return {
						...acc,
						...Object.fromEntries(tagsInfo.map((t) => [t.id, t]))
					};
				}, {}),
				translations: sectionsNonEmpty.reduce((acc, [a, b, c, d, translationsInfo]) => {
					return {
						...acc,
						...Object.fromEntries(translationsInfo.map((t) => [t._id, t[this.lang]]))
					};
				}, {}),
				previewTypes: sectionsNonEmpty.reduce((acc, [a, b, c, d, e, previewTypesInfo]) => {
					return {
						...acc,
						...Object.fromEntries(
							previewTypesInfo.map((p) => {
								return [p.id, { component_reference: p.component_reference }];
							})
						)
					};
				}, {})
			};
		}
	};

	public readonly posts = {
		getIdIfExists: async (slug: PostSelect['slug']) => {
			const post = await db.select({ id: posts.id }).from(posts).where(eq(posts.slug, slug)).get();
			if (post) {
				return post.id;
			} else {
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

			const previewsArr = query.map((rows) => rows.previewTypes).filter(getNullAndDupFilter('id'));
			const allTags = query.map((rows) => rows.tags).filter(getNullAndDupFilter('id'));
			const postTags = query.map((rows) => rows.tagsPosts).filter(getNullAndDupFilter('tag_id'));
			const translArr = query.map((rows) => rows.translations).filter(getNullAndDupFilter('_id'));
			const translForms = query
				.map(({ translForForms: t }) => t)
				.filter(getNullAndDupFilter('_id'));
			const tagForms = allTags.map((tag) => ({
				isCheckedForm: superValidateSync(
					{ ...tag, checked: !!postTags.find((t) => t.tag_id === tag.id) },
					tagUpdateSchema,
					{ id: 'is-checked-' + tag.id }
				),
				name_translation_id: tag.name_translation_id,
				deletionForm: superValidateSync({ id: tag.id }, tagDeleteSchema, {
					id: 'deletion-' + tag.id
				})
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
						return [
							_id,
							superValidateSync(other, translationUpdateSchema, { id: 'translation-' + _id })
						];
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
		getOne: async (username: string, slug: string) => {
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
						.map((row) => row.translations)
						.filter(getNullAndDupFilter('_id'))
						.map((row) => [row._id, row[this.lang]])
				),
				tags: query.map((rows) => rows.tags).filter(getNullAndDupFilter('id'))
			};
		}
	};

	public readonly sections = {
		create: async (pagename: string, translation: TranslationInsert) => {
			const user = await this.user.getOrThrow();
			const foundTags = [] as { tag_id: TagUpdate['id']; lang: SupportedLang }[];

			supportedLanguages.forEach((lang) => {
				const translationText = translation[lang];
				if (nonNull(translationText)) {
					const tokens = marked.lexer(translationText, { mangle: false, headerIds: false });
					const thisLangTags = findTagIdsInLinks(tokens);
					foundTags.push(...thisLangTags.map((tag_id) => ({ tag_id, lang })));
				}
			});

			await db.transaction(async (trx) => {
				const translationForRecord = { ...translation, user_id: user.id };
				const [createdTranslation] = await this.translations.create(
					[translationForRecord],
					'disallow-empty',
					trx
				);
				const page = await trx
					.select({ page_id: pages.id })
					.from(pages)
					.where(and(eq(pages.slug, pagename), eq(pages.user_id, user.id)))
					.get();
				if (!page) {
					throw error(403, ERRORS.NO_SUCH_PAGE_TO_CREATE_POST_ON);
				}
				const { page_id } = page;
				const { section_id } = await trx
					.insert(sections)
					.values({ user_id: user.id, page_id, title_translation_id: createdTranslation._id })
					.returning({ section_id: sections.id })
					.get();

				if (foundTags.length) {
					// Tag ownership check
					const foundUnique = [...new Set(foundTags.map((tag) => tag.tag_id))];
					const existingForUser = await trx
						.select({ tag_id: tags.id })
						.from(tags)
						.where(and(inArray(tags.id, foundUnique), eq(tags.user_id, user.id)))
						.all();
					if (existingForUser.length !== foundUnique.length) {
						throw error(403, ERRORS.SOME_TAGS_DONT_EXIST);
					}

					await trx
						.insert(sectionsTags)
						.values(foundTags.map((tag) => ({ ...tag, section_id })))
						.run();
				}
			});
		},
		update: async (sectionUpdate: SectionUpdate) => {
			const user = await this.user.getOrThrow();
			const { section_id, ...translation } = sectionUpdate;
			const foundTags = [] as { tag_id: TagUpdate['id']; lang: SupportedLang }[];

			supportedLanguages.forEach((lang) => {
				const translationText = translation[lang];
				if (nonNull(translationText)) {
					const tokens = marked.lexer(translationText, { mangle: false, headerIds: false });
					const thisLangTags = findTagIdsInLinks(tokens);
					foundTags.push(...thisLangTags.map((tag_id) => ({ tag_id, lang })));
				}
			});

			await db.transaction(async (trx) => {
				await this.translations.update(translation, trx);

				// Will throw if section does not exist
				await trx
					.select({ section_id: sections.id })
					.from(sections)
					.where(and(eq(sections.id, section_id), eq(sections.user_id, user.id)))
					.get();

				// Tag ownership check
				if (foundTags.length) {
					const foundUnique = [...new Set(foundTags.map((tag) => tag.tag_id))];
					const existingForUser = await trx
						.select({ tag_id: tags.id })
						.from(tags)
						.where(and(inArray(tags.id, foundUnique), eq(tags.user_id, user.id)))
						.all();
					if (existingForUser.length !== foundUnique.length) {
						throw error(403, ERRORS.SOME_TAGS_DONT_EXIST);
					}
				}

				await trx.delete(sectionsTags).where(eq(sectionsTags.section_id, section_id)).run();
				if (foundTags.length) {
					await trx
						.insert(sectionsTags)
						.values(foundTags.map((tag) => ({ ...tag, section_id })))
						.run();
				}
			});
		},
		// TODO Remake all delete params to just id
		delete: async (sectionDelete: SectionDelete) => {
			const user = await this.user.getOrThrow();

			await db.transaction(async (trx) => {
				const translation = await trx
					.select({ title_translation_id: sections.title_translation_id })
					.from(sections)
					.where(and(eq(sections.id, sectionDelete.id), eq(sections.user_id, user.id)))
					.get();
				if (!translation) {
					throw error(403, ERRORS.TRANSLATION_FOR_SECTION_NOT_FOUND);
				}
				const { title_translation_id } = translation;
				await this.translations.delete({ _id: title_translation_id }, trx);
				await trx
					.delete(sectionsTags)
					.where(and(eq(sectionsTags.section_id, sectionDelete.id)))
					.run();
			});
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
				return trx
					.insert(tags)
					.values({ name_translation_id: _id, user_id: user.id })
					.returning()
					.get();
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
			const chosenDBInstance = trx || db;
			return chosenDBInstance
				.insert(translations)
				.values(newTranslations)
				.returning({ _id: translations._id })
				.all();
		},
		update: async (translation: TranslationUpdate, trx?: TransactionContext) => {
			const user = await this.user.getOrThrow();
			const chosenDBInstance = trx || db;
			return chosenDBInstance
				.update(translations)
				.set(translation)
				.where(and(eq(translations._id, translation._id), eq(translations.user_id, user.id)))
				.run();
		},
		delete: async (translation: TranslationDelete, trx?: TransactionContext) => {
			const user = await this.user.getOrThrow();
			const chosenDBInstance = trx || db;
			return chosenDBInstance
				.delete(translations)
				.where(and(eq(translations._id, translation._id), eq(translations.user_id, user.id)))
				.run();
		}
	};
}
export default Plavna;

export type PlavnaService = typeof Plavna;
