import { enrichThemeSets } from '@plavna/design/theming/enricher';
import { browser } from '$app/environment';
import posthog from 'posthog-js';
import { getAppThemeGlob } from '$lib/styles/themes/glob';

import type { LayoutLoad } from './$types';

export const load = (async ({ data }) => {
	if (browser) {
		posthog.init('phc_wjamfmrmL0aYSeD7QFBpwaOFki5H6ia1WH1tGxvEXO3', {
			api_host: 'https://eu.i.posthog.com',
			defaults: '2025-05-24'
		});
	}

	const { themeSet, ...other } = data;

	const themeComponentSets = await enrichThemeSets(themeSet, getAppThemeGlob());

	return { themeComponentSets, themeSet, ...other };
}) satisfies LayoutLoad;
