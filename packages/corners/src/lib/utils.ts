export function getRadii(r: number | number[]): [number, number, number, number] {
	// Handle both single radius and array of 4 radii
	const radii = Array.isArray(r) ? r : [r, r, r, r];

	// Ensure we have exactly 4 radii (pad with last value if needed, or use first 4)
	const [r0, r1, r2, r3] = [
		radii[0] || 0,
		radii[1] || radii[0] || 0,
		radii[2] || radii[0] || 0,
		radii[3] || radii[0] || 0
	];

	return [r0, r1, r2, r3];
}
