import { enrichThemes } from '@plavna/design/themes';
import type { ThemeSet } from '@plavna/design/themes';

import type { ThemeComponentSets } from './themes';

export async function enrichThemeSets(themeSet: ThemeSet | null) {
	if (!themeSet) {
		return null;
	}

	// TODO: Update meta globs
	const designSystemFilesGlob = import.meta.glob('@plavna/design/themes/**/*/Index.svelte');
	const appFilesGlob = import.meta.glob('$lib/features/themes/**/*/Index.svelte');

	const fileSets = { designSystem: designSystemFilesGlob, app: appFilesGlob };

	const themeComponentSets = {} as ThemeComponentSets;

	for (const fileSet in fileSets) {
		const fileSetKey = fileSet as keyof typeof fileSets;
		const glob = fileSets[fileSetKey];

		themeComponentSets[fileSetKey] = await enrichThemes(glob, themeSet);
	}

	return themeComponentSets;
}
