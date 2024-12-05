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
