import type { TagSelect } from './validators';

export type TagsListForPage = Array<Pick<TagSelect, 'id' | 'name_translation_key'>>;
