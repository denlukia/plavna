import type { SystemTranslationKey } from '../i18n/types';

export class ErrorWithTranslation extends Error {
	public translationKey: string;

	constructor(translationKey: SystemTranslationKey) {
		super();
		this.translationKey = translationKey;
	}
}
