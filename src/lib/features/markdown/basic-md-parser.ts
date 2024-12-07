export type BasicMdNode =
	| { type: 'text'; value: string }
	| { type: 'bold'; children: BasicMdNode[] }
	| { type: 'italic'; children: BasicMdNode[] }
	| { type: 'strikethrough'; children: BasicMdNode[] };

export function parseBasicMarkdown(input: string): BasicMdNode[] {
	const patterns = [
		[/\*\*(.+?)\*\*/g, 'bold'], // Bold with **
		[/__(.+?)__/g, 'bold'], // Bold with __
		[/\*(.+?)\*/g, 'italic'], // Italic with *
		[/_([^_]+)_/g, 'italic'], // Italic with _
		[/~~(.+?)~~/g, 'strikethrough'] // Strikethrough with ~~
	] as const;

	function parseInline(text: string): BasicMdNode[] {
		const patternsMatches = patterns.map(([pattern]) => pattern.exec(text));

		const nodes: BasicMdNode[] = [];
		let lastIndex = 0;

		while (lastIndex < text.length) {
			let closestMatch: {
				match: RegExpMatchArray;
				type: 'bold' | 'italic' | 'strikethrough';
				start: number;
			} | null = null;

			// Find the closest match among all patterns
			for (const i in patterns) {
				const [pattern, type] = patterns[i];

				pattern.lastIndex = lastIndex; // Start searching from lastIndex
				const match = patternsMatches[i];

				if (match && match.index >= lastIndex) {
					if (!closestMatch || match.index < closestMatch.start) {
						closestMatch = { match, type, start: match.index };
					}
				}
			}

			if (!closestMatch) break; // No more matches

			const { match, type, start } = closestMatch;
			const matchText = match[0];
			const content = match[1];

			// Add text before the match as a text node
			if (lastIndex < start) {
				nodes.push({ type: 'text', value: text.slice(lastIndex, start) });
			}

			// Add the matched pattern as a parsed node
			nodes.push({ type: type, children: parseInline(content) });

			// Move the lastIndex past this match
			lastIndex = start + matchText.length;
		}

		// Add any remaining text as a text node
		if (lastIndex < text.length) {
			nodes.push({ type: 'text', value: text.slice(lastIndex) });
		}

		return nodes;
	}

	return parseInline(input);
}
