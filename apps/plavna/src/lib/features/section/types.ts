import type { SupportedLang } from '@denlukia/plavna-common/types';

import type { PageSelect, ReaderPageConfig } from '../page/validators';
import type { TagSelect, TagToArticleSelect, TagUpdate } from '../tag/validators';
import type { SectionService } from './service';
import type { SectionSelect } from './validators';

type ActiveTag = { id: TagToArticleSelect['tag_id'] };

export type SectionProp = NonNullable<Awaited<ReturnType<SectionService['getOne']>>>['section'];
export type SectionPropWithAuthorship = SectionProp & {
	forAuthor: NonNullable<SectionProp['forAuthor']>;
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
} & (
	| { pageId: PageSelect['id']; sectionOffset: number }
	| { sectionId: SectionSelect['id']; articlesOffset: number }
);
