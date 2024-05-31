import type { SupportedLang } from '@denlukia/plavna-common/types';
import { error } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import type { User } from 'lucia';
import { ERRORS } from '$lib/collections/errors';
import { db } from '$lib/services/db';

import type { ActorService } from '../user/service';
import type { TransactionContext } from '../common/types';
import { hasNonEmptyProperties } from '../common/utils';
import type { TranslationDelete, TranslationInsertBase, TranslationUpdate } from './parsers';
import { translations } from './schema';
import { defaultLang, isSupportedLang } from './utils';

export class TranslationService {
	private actorService: ActorService;

	public currentLang: SupportedLang;

	constructor(actorService: ActorService, langParam: string | undefined) {
		if (!langParam) {
			this.currentLang = defaultLang;
		} else if (isSupportedLang(langParam)) {
			this.currentLang = langParam;
		} else {
			error(404);
		}

		this.actorService = actorService;
	}

	async create(
		newTranslations: TranslationInsertBase[],
		mode: 'allow-empty' | 'disallow-empty' = 'allow-empty',
		trx?: TransactionContext
	) {
		if (mode === 'disallow-empty') {
			newTranslations.forEach((translation) => {
				if (!hasNonEmptyProperties(translation, ['user_id', 'key'])) {
					error(403, ERRORS.AT_LEAST_ONE_TRANSLATION);
				}
			});
		}

		const actor = await this.actorService.getOrThrow();
		newTranslations = newTranslations.map((translation) => ({
			...translation,
			user_id: actor.id
		}));

		const chosenDBInstance = trx || db;
		return chosenDBInstance
			.insert(translations)
			.values(newTranslations)
			.returning({ key: translations.key })
			.all();
	}
	async update(translation: TranslationUpdate, trx?: TransactionContext, actor?: User) {
		if (!actor) {
			actor = await this.actorService.getOrThrow();
		}
		const chosenDBInstance = trx || db;

		return chosenDBInstance
			.update(translations)
			.set(translation)
			.where(and(eq(translations.key, translation.key), eq(translations.user_id, actor.id)))
			.run();
	}
	async delete(translation: TranslationDelete, trx?: TransactionContext) {
		const actor = await this.actorService.getOrThrow();
		const chosenDBInstance = trx || db;
		return chosenDBInstance
			.delete(translations)
			.where(and(eq(translations.key, translation.key), eq(translations.user_id, actor.id)))
			.run();
	}
}
