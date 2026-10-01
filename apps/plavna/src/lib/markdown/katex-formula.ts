import type { Comment, Element, Root, Text } from 'hast';
import { fromHtml } from 'hast-util-from-html';
import { toHtml } from 'hast-util-to-html';
import katex from 'katex';
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

function elementText(node: Element): string {
	return node.children.map((child) => (child.type === 'text' ? child.value : '')).join('');
}

/**
 * Ukrainian decimal commas (0,9) must not get separator spacing — KaTeX marks
 * every comma as a separator and browsers pad it like a list comma. Only
 * commas directly between digits are tightened; list commas keep spacing.
 */
function fixDecimalCommas(root: Element) {
	visit(root, 'element', (node, _index, parent) => {
		if (node.tagName !== 'mo' || elementText(node) !== ',') return;
		if (typeof parent !== 'object' || parent === null || parent.type !== 'element') return;
		const siblings = parent.children.filter((child): child is Element => child.type === 'element');
		const prev = siblings[siblings.indexOf(node) - 1];
		const next = siblings[siblings.indexOf(node) + 1];
		if (prev?.tagName === 'mn' && next?.tagName === 'mn') {
			node.properties = { ...node.properties, lspace: '0', rspace: '0' };
		}
	});
}

/**
 * Renders TeX with KaTeX core directly (no rehype-katex: its isomorphic HTML
 * parser resolves to a DOMParser build that crashes runtimes without DOM,
 * such as our edge SSR). Emits MathML-only spans for the serializer below.
 */
export const rehypeKatexMathml: Pluggable = () => {
	return (tree: Root): Root => {
		visit(tree, 'element', (node) => {
			if (node.tagName !== 'code') return;
			const classes = classList(node);
			if (!classes.includes('language-math')) return;
			const display = classes.includes('math-display');
			const tex = node.children.map((child) => (child.type === 'text' ? child.value : '')).join('');
			let mathml: string;
			try {
				mathml = katex.renderToString(tex, {
					displayMode: display,
					output: 'mathml',
					strict: false,
					throwOnError: false
				});
			} catch {
				return;
			}
			node.tagName = 'span';
			node.properties = { className: [display ? 'katex-display' : 'katex'] };
			node.children = fromHtml(mathml, { fragment: true }).children.filter(
				(child): child is Comment | Element | Text =>
					child.type === 'comment' || child.type === 'element' || child.type === 'text'
			);
		});
		return tree;
	};
};

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
			fixDecimalCommas(node);
			const html = toHtml(node);
			node.tagName = 'katexformula';
			node.properties = { html };
			node.children = [];
		}
		return tree;
	};
};
