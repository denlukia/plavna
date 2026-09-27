export type MdDocument = {
	title: string | null;
	slug: string | null;
	description: string | null;
	body: string;
};

function unquote(value: string): string {
	const trimmed = value.trim();
	if (
		(trimmed.startsWith('"') && trimmed.endsWith('"')) ||
		(trimmed.startsWith("'") && trimmed.endsWith("'"))
	) {
		return trimmed.slice(1, -1);
	}
	return trimmed;
}

function parseFrontmatterBlock(block: string): Record<string, string> {
	const result: Record<string, string> = {};
	for (const line of block.split('\n')) {
		const match = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
		if (!match) continue;
		result[match[1].toLowerCase()] = unquote(match[2]);
	}
	return result;
}

function stripInlineMarkdown(value: string): string {
	return value
		.replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
		.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
		.replace(/(\*\*|__)(.*?)\1/g, '$2')
		.replace(/(\*|_|~~|`)(.*?)\1/g, '$2')
		.trim();
}

function titleFromFirstHeading(body: string): string | null {
	for (const line of body.split('\n')) {
		const trimmed = line.trim();
		if (!trimmed) continue;
		const match = trimmed.match(/^#{1,6}\s+(.+?)\s*#*\s*$/);
		if (match) {
			const title = stripInlineMarkdown(match[1]);
			return title || null;
		}
		return null;
	}
	return null;
}

export function parseMdDocument(source: string): MdDocument {
	const frontmatterMatch = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
	const frontmatter = frontmatterMatch ? parseFrontmatterBlock(frontmatterMatch[1]) : {};
	const body = frontmatterMatch ? source.slice(frontmatterMatch[0].length) : source;

	const fromFrontmatter = (key: string): string | null => {
		const value = frontmatter[key]?.trim();
		return value ? value : null;
	};

	return {
		title: fromFrontmatter('title') ?? titleFromFirstHeading(body),
		slug: fromFrontmatter('slug'),
		description: fromFrontmatter('description'),
		body
	};
}
