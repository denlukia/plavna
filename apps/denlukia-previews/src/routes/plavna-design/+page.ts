import type { ThemeSet } from '@plavna/design/theming/basics';
import { enrichThemes } from '@plavna/design/theming/enricher';

export async function load() {
	const themeSet: ThemeSet = {
		color: 'milk',
		style: 'modern',
		typographyInterface: 'inter',
		typographyMarkdown: 'inter'
	};

	const dsThemeComponentSet = await enrichThemes(null, themeSet);

	return {
		themeSet,
		dsThemeComponentSet
	};
}
