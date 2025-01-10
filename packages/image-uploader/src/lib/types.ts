import type { supportedLangs } from './constants';

export type { ImagePathUpdateOrDeletion } from './images/types';
export type { ImageProviderRelatedActorData } from './images/types';

export function assert<T extends never>() {}
export type TypeEqualityGuard<A, B> = Exclude<A, B> | Exclude<B, A>;

export type SupportedLang = (typeof supportedLangs)[number];
