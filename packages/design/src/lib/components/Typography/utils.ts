import { defaultThemeSet } from '../../theming';
import { getThemeContext } from '../../theming/context';
import { getThemeClass } from '../../theming/themes';

export function getGlobalTypographyClass(purpose: 'interface' | 'markdown') {
	const themeContext = getThemeContext();
	const themeKey =
		purpose === 'interface' ? ('typographyInterface' as const) : ('typographyMarkdown' as const);
	const themeId = themeContext ? themeContext[themeKey] : defaultThemeSet[themeKey];

	return getThemeClass('typography', themeId);
}
