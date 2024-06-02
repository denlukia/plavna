import type { TagSelect, TagToArticleSelect } from '../tag/parsers';
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
};

export type SectionReconfigRequest = {
	sectionId: SectionSelect['id'];
	tagId: TagSelect['id'];
	newChecked: boolean;
};
