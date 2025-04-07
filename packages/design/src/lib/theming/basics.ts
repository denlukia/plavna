import type { Component } from 'svelte';

export const typographyInterfaceThemes = ['inter', 'sequences', 'nyght'] as const;
export const typographyMarkdownThemes = ['inter-markdown', 'sequences', 'nyght'] as const;

export const allThemes = {
	color: ['milk'],
	style: ['modern'],
	typographyInterface: typographyInterfaceThemes,
	typographyMarkdown: typographyMarkdownThemes
} as const;

export type ColorTheme = (typeof allThemes.color)[number];
export type StyleTheme = (typeof allThemes.style)[number];
export type TypographyInterfaceTheme = (typeof typographyInterfaceThemes)[number];
export type TypographyMarkdownTheme = (typeof typographyMarkdownThemes)[number];

export type ThemeComponentSets = {
	designSystem: ThemeComponentSet;
	app: ThemeComponentSet;
};

export type ThemeSet = {
	color: ColorTheme;
	style: StyleTheme;
	typographyInterface: TypographyInterfaceTheme;
	typographyMarkdown: TypographyMarkdownTheme;
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
	typographyMarkdown: 'inter-markdown'
};

export function getThemeClass(type: 'color' | 'style' | 'typography', id: string) {
	return `global-theme-${type}-${id}`;
}
