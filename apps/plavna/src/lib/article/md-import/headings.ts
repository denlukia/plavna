/**
 * Shifts ATX heading levels by the given amount (positive adds `#`, i.e. demotes
 * headings deeper; negative removes `#`, i.e. promotes them). Levels are clamped
 * to 1..6. Fenced code blocks and Setext headings are left untouched.
 */
export function shiftHeadings(md: string, shift: number): string {
	if (!shift) return md;
	let inFence = false;
	return md
		.split('\n')
		.map((line) => {
			if (/^\s*```/.test(line)) {
				inFence = !inFence;
				return line;
			}
			if (inFence) return line;
			const match = line.match(/^(#{1,6})(?=\s|$)/);
			if (!match) return line;
			const next = Math.min(6, Math.max(1, match[1].length + shift));
			return '#'.repeat(next) + line.slice(match[1].length);
		})
		.join('\n');
}
