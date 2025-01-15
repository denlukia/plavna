import { defaultThemeSet, getThemeClass } from '../../theming/basics';
import { getThemeContext } from '../../theming/context';

export function getGlobalTypographyClass(purpose: 'interface' | 'markdown') {
	const themeContext = getThemeContext();
	const themeKey =
		purpose === 'interface' ? ('typographyInterface' as const) : ('typographyMarkdown' as const);
	const themeId = themeContext ? themeContext[themeKey] : defaultThemeSet[themeKey];

	return getThemeClass('typography', themeId);
}
