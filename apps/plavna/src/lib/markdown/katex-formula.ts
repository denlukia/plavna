import type { Element, Root } from 'hast';
import { toHtml } from 'hast-util-to-html';
import type { Pluggable } from 'unified';
import { visit } from 'unist-util-visit';

function classList(node: Element): string[] {
	const className = node.properties?.className;
	return Array.isArray(className) ? className.map(String) : [];
}

function isKatexSpan(node: unknown): node is Element {
	if (typeof node !== 'object' || node === null) return false;
	const el = node as Element;
	return (
		el.type === 'element' &&
		el.tagName === 'span' &&
		classList(el).some((c) => c === 'katex' || c === 'katex-display')
	);
}

/** Drops KaTeX's HTML rendition — we render native MathML only. */
function stripKatexHtml(node: Element) {
	node.children = node.children.filter((child) => {
		if (child.type !== 'element') return true;
		if (child.tagName === 'span' && classList(child).includes('katex-html')) return false;
		stripKatexHtml(child);
		return true;
	});
}

/**
 * Serializes KaTeX output (and bare <math>) into raw HTML rendered via {@html}.
 * svelte-exmarkdown mounts unknown elements with `document.createElement`,
 * which puts MathML in the HTML namespace where browsers render it as linear
 * text. Reparsing the same markup lets the HTML parser assign the MathML
 * namespace, so SSR and hydrated output stay identical.
 */
export const rehypeKatexFormula: Pluggable = () => {
	return (tree: Root): Root => {
		const matches: Element[] = [];
		visit(tree, 'element', (node, _index, parent) => {
			if (node.tagName === 'math' && !isKatexSpan(parent)) {
				matches.push(node);
				return;
			}
			if (isKatexSpan(node) && !isKatexSpan(parent)) {
				matches.push(node);
			}
		});
		for (const node of matches) {
			stripKatexHtml(node);
			const html = toHtml(node);
			node.tagName = 'katexformula';
			node.properties = { html };
			node.children = [];
		}
		return tree;
	};
};
