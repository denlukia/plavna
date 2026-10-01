import type { SystemTranslationKey } from '../../i18n/types';

export type MdImageRef = {
	alt: string;
	url: string;
	start: number;
	end: number;
};

export type MdImportWarning = {
	key: SystemTranslationKey;
	file: string;
};

const MD_IMAGE_RE = /!\[([^\]]*)\]\(\s*<?([^\s)>]+)>?(?:\s+["'][^"')]*["'])?\s*\)/g;
const HTML_IMG_RE = /<img\b[^>]*src\s*=\s*["']([^"']+)["'][^>]*>/gi;
const HTML_ALT_RE = /\balt\s*=\s*["']([^"']*)["']/i;

/** Finds `![](url)` and `<img src>` references in markdown, in document order. */
export function extractImageRefs(md: string): MdImageRef[] {
	const refs: MdImageRef[] = [];
	for (const m of md.matchAll(MD_IMAGE_RE)) {
		refs.push({ alt: m[1], url: m[2], start: m.index, end: m.index + m[0].length });
	}
	for (const m of md.matchAll(HTML_IMG_RE)) {
		const alt = m[0].match(HTML_ALT_RE)?.[1] ?? '';
		refs.push({ alt, url: m[1], start: m.index, end: m.index + m[0].length });
	}
	return refs.sort((a, b) => a.start - b.start);
}

/** Resolves an image reference against the md file's raw directory URL. Returns null for non-http(s). */
export function resolveImageUrl(ref: string, rawDirUrl: string): string | null {
	try {
		const parsed = new URL(ref, rawDirUrl.endsWith('/') ? rawDirUrl : rawDirUrl + '/');
		if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
		return parsed.href;
	} catch {
		return null;
	}
}

/** Replaces one reference slice with a Plavna `![alt](id)` code. Apply from last to first. */
export function rewriteImageRef(md: string, ref: MdImageRef, imageId: number): string {
	return md.slice(0, ref.start) + `![${ref.alt}](${imageId})` + md.slice(ref.end);
}
