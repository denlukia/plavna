import { getContext, setContext } from 'svelte';

const sectionContextName = 'section-context';
const defaultSectionContext = {
	section: false
};

export function setSectionContext(value?: typeof defaultSectionContext) {
	return setContext(sectionContextName, value || defaultSectionContext);
}

export function getSectionContext() {
	return getContext<typeof defaultSectionContext | undefined>(sectionContextName);
}
