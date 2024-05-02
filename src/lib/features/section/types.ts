import type { SuperValidated } from 'sveltekit-superforms';

import type { ArticleSelect } from '../article/parsers';
import type { TagSelect, TagToArticleSelect } from '../tag/parsers';
import type { SectionDelete, SectionSelect, SectionUpdate } from './parsers';

type ActiveTag = { id: TagToArticleSelect['tag_id'] };

export type SectionProp = {
	meta: SectionSelect;
	activeTags: Array<ActiveTag>;
	articles: Array<{ meta: ArticleSelect; tags: Array<TagSelect> }>;
	forms: {
		updating: SuperValidated<SectionUpdate>;
		deletion: SuperValidated<SectionDelete>;
	} | null;
};
export type SectionPropWithAuthorship = SectionProp & {
	forms: NonNullable<SectionProp['forms']>;
};
export type OnTagSwitchFunction = (tagId: TagSelect['id'], checked: boolean) => void;

export type SectionContext = {
	activeTags: Array<ActiveTag>;
	onTagSwitch?: OnTagSwitchFunction;
};

export type SectionReconfigRequest = {
	sectionId: SectionSelect['id'];
	tagId: TagSelect['id'];
	checked: boolean;
};
