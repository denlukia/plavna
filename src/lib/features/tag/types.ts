import type { TagSelect } from './parsers';

export type TagsListForPage = Array<Pick<TagSelect, 'id' | 'name_translation_key'>>;
