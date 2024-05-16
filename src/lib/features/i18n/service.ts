import type { SupportedLang } from '@denlukia/plavna-common/types';
import { error } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import type { User } from 'lucia';
import { ERRORS } from '$lib/collections/errors';
import { db } from '$lib/services/db';

import type { UserService } from '../auth/service';
import type { TransactionContext } from '../common/types';
import { hasNonEmptyProperties } from '../common/utils';
import type { TranslationDelete, TranslationInsertBase, TranslationUpdate } from './parsers';
import { translations } from './schema';
import { defaultLang, isSupportedLang } from './utils';

export class TranslationService {
	private userService: UserService;

	public currentLang: SupportedLang;

	constructor(userService: UserService, langParam: string | undefined) {
		if (!langParam) {
			this.currentLang = defaultLang;
		} else if (isSupportedLang(langParam)) {
			this.currentLang = langParam;
		} else {
			error(404);
		}

		this.userService = userService;
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

		const user = await this.userService.getOrThrow();
		newTranslations = newTranslations.map((translation) => ({
			...translation,
			user_id: user.id
		}));

		const chosenDBInstance = trx || db;
		return chosenDBInstance
			.insert(translations)
			.values(newTranslations)
			.returning({ key: translations.key })
			.all();
	}
	async update(translation: TranslationUpdate, trx?: TransactionContext, user?: User) {
		if (!user) {
			user = await this.userService.getOrThrow();
		}
		const chosenDBInstance = trx || db;

		return chosenDBInstance
			.update(translations)
			.set(translation)
			.where(and(eq(translations.key, translation.key), eq(translations.user_id, user.id)))
			.run();
	}
	async delete(translation: TranslationDelete, trx?: TransactionContext) {
		const user = await this.userService.getOrThrow();
		const chosenDBInstance = trx || db;
		return chosenDBInstance
			.delete(translations)
			.where(and(eq(translations.key, translation.key), eq(translations.user_id, user.id)))
			.run();
	}
}
