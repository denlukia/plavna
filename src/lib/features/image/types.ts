import type { SupportedLang } from '@denlukia/plavna-common/types';
import type { User } from 'lucia';

import type { TransactionContext } from '../common/types';
import type { ImageInsert, ImageSelect, ImageUpdate } from './parsers';

export type ImageAnyParams = {
	lang: SupportedLang | null;
	user: User;
	trx?: TransactionContext;
};
export type ImageCreationParams = {
	mode: 'create';
	initialImage: ImageInsert;
};
export type ImagesUpdateParams = {
	mode: 'update';
	initialImage: ImageUpdate;
};

export type ImagesStore = Record<ImageSelect['id'], Omit<ImageSelect, 'id'>>;
