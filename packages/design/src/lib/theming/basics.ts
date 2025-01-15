import type { Component } from 'svelte';

export const typographyThemes = ['inter', 'sequences', 'nyght'] as const;

export const allThemes = {
	color: ['milk'],
	style: ['modern'],
	typographyInterface: typographyThemes,
	typographyMarkdown: typographyThemes
} as const;

export type ColorTheme = (typeof allThemes.color)[number];
export type StyleTheme = (typeof allThemes.style)[number];
export type TypographyTheme = (typeof typographyThemes)[number];

export type ThemeComponentSets = {
	designSystem: ThemeComponentSet;
	app: ThemeComponentSet;
};

export type ThemeSet = {
	color: ColorTheme;
	style: StyleTheme;
	typographyInterface: TypographyTheme;
	typographyMarkdown: TypographyTheme;
};

export type ThemeComponentSet = Partial<{
	color: Component;
	style: Component;
	typographyInterface: Component;
	typographyMarkdown: Component;
}>;

export const defaultThemeSet: ThemeSet = {
	color: 'milk',
	style: 'modern',
	typographyInterface: 'inter',
	typographyMarkdown: 'inter'
};

export function getThemeClass(type: 'color' | 'style' | 'typography', id: string) {
	return `global-theme-${type}-${id}`;
}
