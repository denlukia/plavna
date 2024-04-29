import type { SuperValidated } from 'sveltekit-superforms';

import type { ArticleSelect } from '../article/parsers';
import type { TagSelect, TagToArticleSelect } from '../tag/parsers';
import type { SectionDelete, SectionSelect, SectionUpdate } from './parsers';

export type SectionProp = {
	meta: SectionSelect;
	articles: ArticleSelect[];
	tagsArticles: TagToArticleSelect[];
	forms: {
		updating: SuperValidated<SectionUpdate>;
		deletion: SuperValidated<SectionDelete>;
	} | null;
};
export type SectionPropWithAuthorship = SectionProp & {
	forms: NonNullable<SectionProp['forms']>;
};
export type OnTagSwitchFunction = (tagId: TagSelect['id'], newState: boolean) => void;

export type SectionContext = {
	onTagSwitch?: OnTagSwitchFunction;
};
