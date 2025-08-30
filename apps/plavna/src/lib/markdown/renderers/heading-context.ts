import type { TextSizes } from '@plavna/design/components';
import { getContext, setContext } from 'svelte';

export function depthToTypographySize(depth: number | undefined | null, chooseShort?: boolean) {
	if (!depth) return 'body-short' as const;
	if (depth === 1) {
		return 'heading-1' as const;
	} else if (depth === 2) {
		return 'heading-2' as const;
	} else {
		return chooseShort ? ('headline-short' as const) : ('headline' as const);
	}
}

type TypographyContext = { size: TextSizes };

const typographyContextName = 'typography-context';
const defaultTypographyContext: TypographyContext = {
	size: 'body'
};

export function setTypographyContext(context: TypographyContext = defaultTypographyContext) {
	return setContext(typographyContextName, context);
}

export function getTypographyContext() {
	return getContext<TypographyContext | undefined>(typographyContextName);
}
