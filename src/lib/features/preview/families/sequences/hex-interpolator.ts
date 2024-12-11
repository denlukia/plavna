/**
 * Interpolates between two RGB hex colors by a given percentage.
 * @param hex1 - The starting color in RGB hex format (e.g., "#FF0000").
 * @param hex2 - The ending color in RGB hex format (e.g., "#00FF00").
 * @param percentage - A number between 0 and 1 representing the interpolation percentage.
 * @returns The interpolated RGB hex color.
 */
export function interpolateHexColors(hex1: string, hex2: string, percentage: number): string {
	// Clamp percentage between 0 and 1
	const clampedPercentage = Math.min(Math.max(percentage, 0), 1);

	// Convert a hex color to its RGB components
	const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
		const sanitizedHex = hex.replace('#', '');
		const bigint = parseInt(sanitizedHex, 16);
		return {
			r: (bigint >> 16) & 255,
			g: (bigint >> 8) & 255,
			b: bigint & 255
		};
	};

	// Convert RGB components back to a hex color
	const rgbToHex = (r: number, g: number, b: number): string => {
		return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
	};

	const rgb1 = hexToRgb(hex1);
	const rgb2 = hexToRgb(hex2);

	console.log(hex1, rgb1, hex2, rgb2);

	// Interpolate each component
	const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * clampedPercentage);
	const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * clampedPercentage);
	const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * clampedPercentage);

	return rgbToHex(r, g, b);
}
