import type { Element, Root } from 'hast';
import type { Pluggable } from 'unified';
import { visit } from 'unist-util-visit';

function hasVisibleText(node: Element): boolean {
	if (['img', 'math', 'svg', 'video'].includes(node.tagName)) return true;
	return node.children.some((child) => {
		if (child.type === 'text') return child.value.trim() !== '';
		if (child.type === 'element') return hasVisibleText(child);
		return false;
	});
}

/**
 * Drops header rows with no visible content (e.g. GFM tables that need a
 * header row syntactically but have none semantically), so no orphan header
 * rule is drawn.
 */
export const rehypeDropEmptyThead: Pluggable = () => {
	return (tree: Root): Root => {
		const removals: Array<{ parent: Element; index: number }> = [];
		visit(tree, 'element', (node, index, parent) => {
			if (node.tagName !== 'thead') return;
			if (typeof parent !== 'object' || parent === null || parent.type !== 'element') return;
			if (typeof index !== 'number') return;
			const rows = node.children.filter(
				(child): child is Element => child.type === 'element' && child.tagName === 'tr'
			);
			if (rows.length > 0 && rows.every((row) => !hasVisibleText(row))) {
				removals.push({ parent, index });
			}
		});
		for (const { parent, index } of removals.reverse()) {
			parent.children.splice(index, 1);
		}
		return tree;
	};
};
