import { getContext, setContext } from 'svelte';

const listContextName = 'markdown-context';
const defaultListContext = {
	chooseShort: false,
	onlyBasic: false
};

export function setMarkdownContext(value?: typeof defaultListContext) {
	return setContext(listContextName, value || defaultListContext);
}

export function getMarkdownContext() {
	return getContext<typeof defaultListContext | undefined>(listContextName);
}
