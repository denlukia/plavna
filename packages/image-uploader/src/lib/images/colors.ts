import type { BrowserOptions } from 'extract-colors/lib/types/Options';

export const extractorConfig: BrowserOptions = {
	pixels: 2500,
	distance: 0.05
};

import type { extractColors } from 'extract-colors';

export type RGBColor = [number, number, number];
export type HSLColor = {
	h: number;
	s: number;
	l: number;
};
export type HSLwithArea = HSLColor & {
	area: number;
};

export function HSLToString(hsl: HSLColor | HSLwithArea) {
	return `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`;
}

export function RGBToHSL([r, g, b]: RGBColor): HSLColor {
	r /= 255;
	g /= 255;
	b /= 255;
	const l = Math.max(r, g, b);
	const s = l - Math.min(r, g, b);
	const h = s ? (l === r ? (g - b) / s : l === g ? 2 + (b - r) / s : 4 + (r - g) / s) : 0;
	return {
		h: Math.round(60 * h < 0 ? 60 * h + 360 : 60 * h),
		s: Math.round(100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0)),
		l: Math.round((100 * (2 * l - s)) / 2)
	};
}

export function findOptimalColor(colors: HSLwithArea[]) {
	return colors.sort((a, b) => b.area - a.area)[0];
}

export function finalColorToHSL(finalColor: Awaited<ReturnType<typeof extractColors>>[0]) {
	return {
		h: finalColor.hue * 360,
		s: finalColor.saturation * 100,
		l: finalColor.lightness * 100,
		area: finalColor.area
	};
}
