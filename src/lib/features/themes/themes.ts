import type { Component } from 'svelte';

export const themes = {
	color: ['milk'],
	style: ['modern'],
	typography: ['inter']
} as const;

export type ColorTheme = (typeof themes.color)[number];
export type StyleTheme = (typeof themes.style)[number];
export type TypographyTheme = (typeof themes.typography)[number];

export type ThemeSet = {
	color: ColorTheme;
	style: StyleTheme;
	typography: TypographyTheme;
};

export const defaultThemeSet: ThemeSet = {
	color: themes.color[0],
	style: themes.style[0],
	typography: themes.typography[0]
};

export type ThemeComponentSet = {
	color: Component;
	style: Component;
	typography: Component;
};
