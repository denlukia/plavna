import type { PreviewTemplateSelect } from './parsers';

export type PreviewTypes = Record<
	PreviewTemplateSelect['id'],
	{ url: PreviewTemplateSelect['url'] }
>;
