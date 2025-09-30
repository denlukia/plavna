import { deserializePreviewParams } from '@plavna/common';
import type { ThemeSet } from '@plavna/design/theming/basics';
import { enrichThemes } from '@plavna/design/theming/enricher';

export async function load({ url }) {
	const themeSet: ThemeSet = {
		color: 'milk',
		style: 'modern',
		typographyInterface: 'inter',
		typographyMarkdown: 'sequences'
	};

	const dsThemeComponentSet = await enrichThemes(null, themeSet);

	return {
		...deserializePreviewParams(url.toString()),
		themeSet,
		themeComponentLayers: { designSystem: dsThemeComponentSet, app: {} }
	};
}
