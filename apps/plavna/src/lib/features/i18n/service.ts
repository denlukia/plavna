import type { SupportedLang } from '@plavna/image-uploader/types';
import { error } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import type { User } from 'lucia';
import { ERRORS } from '$lib/collections/errors';
import { db } from '$lib/services/db';

import type { TransactionOrDB } from '../common/types';
import { hasNonEmptyPropsBeyondSpecified } from '../common/utils';
import type { ActorService } from '../user/service';
import { table_translations } from './schema';
import { checkTranslationKey } from './utils';
import type { TranslationDelete, TranslationInsertBase, TranslationUpdate } from './validators';

export class TranslationService {
	private actorService: ActorService;

	public currentLang: SupportedLang;

	constructor(actorService: ActorService, langParam: SupportedLang) {
		this.currentLang = langParam;
		this.actorService = actorService;
	}

	async create(
		newTranslations: TranslationInsertBase[],
		mode: 'allow-empty' | 'disallow-empty' = 'allow-empty',
		trx: TransactionOrDB = db,
		actor?: User
	) {
		if (!actor) {
			actor = await this.actorService.getOrThrow();
		}

		if (mode === 'disallow-empty') {
			newTranslations.forEach((translation) => {
				if (!hasNonEmptyPropsBeyondSpecified(translation, ['user_id', 'key'])) {
					error(403, checkTranslationKey('actor_errors.at_least_one_translation'));
				}
			});
		}

		newTranslations = newTranslations.map((translation) => ({
			...translation,
			user_id: actor.id
		}));

		return trx.insert(table_translations).values(newTranslations).returning().all();
	}
	async update(translation: TranslationUpdate, trx: TransactionOrDB = db, actor?: User) {
		if (!actor) {
			actor = await this.actorService.getOrThrow();
		}

		return trx
			.update(table_translations)
			.set(translation)
			.where(
				and(eq(table_translations.key, translation.key), eq(table_translations.user_id, actor.id))
			)
			.returning()
			.get();
	}
	async delete(translation: TranslationDelete, trx: TransactionOrDB = db) {
		const actor = await this.actorService.getOrThrow();

		return trx
			.delete(table_translations)
			.where(
				and(eq(table_translations.key, translation.key), eq(table_translations.user_id, actor.id))
			)
			.run();
	}
}
