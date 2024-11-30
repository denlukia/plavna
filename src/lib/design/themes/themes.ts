import type { Component } from 'svelte';

export const themes = {
	color: ['milk'],
	style: ['modern'],
	'typography/functional': ['inter', 'manrope'],
	'typography/aesthetic': ['inter', 'nyght']
} as const;

export type ColorTheme = (typeof themes.color)[number];
export type StyleTheme = (typeof themes.style)[number];
export type TypographyFunctionalTheme = (typeof themes)['typography/functional'][number];
export type TypographyAestheticTheme = (typeof themes)['typography/aesthetic'][number];

export type ThemeSet = {
	color: ColorTheme;
	style: StyleTheme;
	'typography/functional': TypographyFunctionalTheme;
	'typography/aesthetic': TypographyAestheticTheme;
};

export const defaultThemeSet: ThemeSet = {
	color: 'milk',
	style: 'modern',
	'typography/functional': 'inter',
	'typography/aesthetic': 'inter'
};

export type ThemeComponentSet = Partial<{
	color: Component;
	style: Component;
	'typography/functional': Component;
	'typography/aesthetic': Component;
}>;
