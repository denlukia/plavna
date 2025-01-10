import { getContext, setContext } from 'svelte';

const listContextName = 'list-context';
const defaultListContext = {
	list: true
};

export function setListContext() {
	return setContext(listContextName, defaultListContext);
}

export function getListContext() {
	return getContext<typeof defaultListContext | undefined>(listContextName);
}
