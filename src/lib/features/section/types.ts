import type { SupportedLang } from '@denlukia/plavna-common/types';

import type { PageSelect, ReaderPageConfig } from '../page/parsers';
import type { TagSelect, TagToArticleSelect, TagUpdate } from '../tag/parsers';
import type { SectionSelect } from './parsers';
import type { SectionService } from './service';

type ActiveTag = { id: TagToArticleSelect['tag_id'] };

export type SectionProp = NonNullable<Awaited<ReturnType<SectionService['getOne']>>>['section'];
export type SectionPropWithAuthorship = SectionProp & {
	forms: NonNullable<SectionProp['forms']>;
};
export type OnTagSwitchFunction = (tagId: TagSelect['id'], checked: boolean) => void;

export type SectionContext = {
	id: SectionSelect['id'];
	activeTags: Array<ActiveTag>;
	onTagSwitch?: OnTagSwitchFunction;
	loadingTagId: TagSelect['id'] | null;
};

type TagSwitchRequest = {
	tagId: TagSelect['id'];
	newChecked: boolean;
};
type ArticlesPaginationRequest = { offset: number };

export type SectionRequest = {
	sectionId: SectionSelect['id'];
} & (TagSwitchRequest | ArticlesPaginationRequest);

export type TagIdWithLang = { tag_id: TagUpdate['id']; lang: SupportedLang };

export type GetOneSectionParams = {
	username: string;
	readerPageConfig: ReaderPageConfig | null;
	articlesOffset: number;
} & ({ pageId: PageSelect['id']; sectionOffset: number } | { sectionId: SectionSelect['id'] });
