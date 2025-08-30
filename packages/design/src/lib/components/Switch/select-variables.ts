import type { TextSizes } from '../Typography';

export function selectVariables(
	size: TextSizes | undefined,
	getVariables: (size: string) => string
) {
	let resolvedSize: string;

	if (size && ['heading-1', 'heading-2'].includes(size)) {
		resolvedSize = size;
	} else {
		resolvedSize = 'body';
	}

	return getVariables(resolvedSize);
}
