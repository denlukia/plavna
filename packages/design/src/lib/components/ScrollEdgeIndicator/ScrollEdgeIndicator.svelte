<script lang="ts">
	import type { Snippet } from 'svelte';
	import { fade } from 'svelte/transition';

	/**
	 * Wraps scrollable content and shows 1px border + gradient on edges where content is clipped.
	 * Can auto-detect scroll state from a viewport ref, or accept manual top/bottom/left/right props.
	 * Mask softens gradient corners; border is separate and not masked.
	 *
	 * Default wrapper styling (flex min-height-0 flex-1 column, overflow hidden) suits
	 * flex-column layouts where the viewport child should scroll. Override via class prop.
	 */

	type Props = {
		/** Ref to the scrollable viewport element. When set, scroll state is auto-detected. */
		viewportRef?: HTMLElement | null;
		/** Manual override: show indicator on top edge */
		top?: boolean;
		/** Manual override: show indicator on bottom edge */
		bottom?: boolean;
		/** Manual override: show indicator on left edge */
		left?: boolean;
		/** Manual override: show indicator on right edge */
		right?: boolean;
		/** Gradient opacity at edge (0–1). Default 0.25 */
		gradientOpacity?: number;
		/** Gradient extent in px. Default 30 */
		gradientExtent?: number;
		/**
		 * Insets the edges from the top/bottom of the wrapper, in px. Set this
		 * to the height of a sticky header or footer inside the viewport so the
		 * indicator draws against the scrolling content rather than behind the
		 * pinned row. Also shortens the left/right edges by the same amounts.
		 */
		topOffset?: number;
		bottomOffset?: number;
		/** Show 1px border on top edge. Default true */
		borderTop?: boolean;
		/** Show 1px border on bottom edge. Default true */
		borderBottom?: boolean;
		/** Show 1px border on left edge. Default true */
		borderLeft?: boolean;
		/** Show 1px border on right edge. Default true */
		borderRight?: boolean;
		/** Additional CSS classes for the wrapper */
		class?: string;
		children?: Snippet;
	};

	let {
		viewportRef = $bindable(null),
		top: topProp,
		bottom: bottomProp,
		left: leftProp,
		right: rightProp,
		gradientOpacity = 0.25,
		gradientExtent = 30,
		topOffset = 0,
		bottomOffset = 0,
		borderTop = true,
		borderBottom = true,
		borderLeft = true,
		borderRight = true,
		class: className = '',
		children
	}: Props = $props();

	let top = $state(false);
	let bottom = $state(false);
	let left = $state(false);
	let right = $state(false);

	let rafId: number | null = null;

	function updateFromViewport(el: HTMLElement | null) {
		if (!el) return;
		const { scrollTop, scrollLeft, clientHeight, clientWidth, scrollHeight, scrollWidth } = el;
		const threshold = 2;
		const hasVerticalOverflow = scrollHeight > clientHeight + threshold;
		const hasHorizontalOverflow = scrollWidth > clientWidth + threshold;
		top = hasVerticalOverflow && scrollTop > threshold;
		bottom = hasVerticalOverflow && scrollTop + clientHeight < scrollHeight - threshold;
		left = hasHorizontalOverflow && scrollLeft > threshold;
		right = hasHorizontalOverflow && scrollLeft + clientWidth < scrollWidth - threshold;
	}

	function scheduleUpdate() {
		if (rafId != null) return;
		rafId = requestAnimationFrame(() => {
			rafId = null;
			if (viewportRef) updateFromViewport(viewportRef);
		});
	}

	$effect(() => {
		const el = viewportRef;
		if (
			!el ||
			topProp !== undefined ||
			bottomProp !== undefined ||
			leftProp !== undefined ||
			rightProp !== undefined
		) {
			return;
		}

		const observeChildren = (observer: ResizeObserver) => {
			for (const child of el.children) {
				observer.observe(child);
			}
		};

		updateFromViewport(el);
		// Layout often settles after the first paint (flex/async content).
		let layoutRaf2: number | null = null;
		const layoutRaf1 = requestAnimationFrame(() => {
			updateFromViewport(el);
			layoutRaf2 = requestAnimationFrame(() => updateFromViewport(el));
		});

		el.addEventListener('scroll', scheduleUpdate, { passive: true });

		const resizeObserver = new ResizeObserver(scheduleUpdate);
		resizeObserver.observe(el);
		observeChildren(resizeObserver);

		const mutationObserver = new MutationObserver(() => {
			observeChildren(resizeObserver);
			scheduleUpdate();
		});
		mutationObserver.observe(el, {
			childList: true,
			subtree: true,
			characterData: true
		});

		return () => {
			cancelAnimationFrame(layoutRaf1);
			if (layoutRaf2 != null) cancelAnimationFrame(layoutRaf2);
			if (rafId != null) {
				cancelAnimationFrame(rafId);
				rafId = null;
			}
			el.removeEventListener('scroll', scheduleUpdate);
			resizeObserver.disconnect();
			mutationObserver.disconnect();
		};
	});

	const showTop = $derived(topProp ?? top);
	const showBottom = $derived(bottomProp ?? bottom);
	const showLeft = $derived(leftProp ?? left);
	const showRight = $derived(rightProp ?? right);

	const gradientStops = $derived(
		`color-mix(in srgb, currentColor ${gradientOpacity * 100}%, transparent), color-mix(in srgb, currentColor ${gradientOpacity * 17}%, transparent) 70%, transparent`
	);
	const borderStyle = '1px solid var(--scroll-edge-border, currentColor)';
	const maskBase = 'transparent, black 15%, black 85%, transparent';
	const maskSize = 'mask-size: 100% 100%; -webkit-mask-size: 100% 100%;';

	const edges = $derived([
		{
			id: 'top',
			show: showTop,
			showBorder: borderTop,
			placement: 'left: 0; right: 0;',
			size: `height: ${gradientExtent}px; top: ${topOffset}px`,
			borderSide: 'border-top',
			borderStyle: 'position: relative; height: 1px; width: 100%; flex-shrink: 0;',
			gradient: `linear-gradient(to bottom, ${gradientStops})`,
			mask: `linear-gradient(to right, ${maskBase})`,
			gradientStyle: `left: 0; right: 0; top: ${borderTop ? '1px' : '0'}; bottom: 0;`
		},
		{
			id: 'bottom',
			show: showBottom,
			showBorder: borderBottom,
			placement: 'left: 0; right: 0;',
			size: `height: ${gradientExtent}px; bottom: ${bottomOffset}px`,
			borderSide: 'border-bottom',
			borderStyle: 'position: absolute; bottom: 0; left: 0; right: 0; height: 1px;',
			gradient: `linear-gradient(to top, ${gradientStops})`,
			mask: `linear-gradient(to right, ${maskBase})`,
			gradientStyle: `left: 0; right: 0; bottom: ${borderBottom ? '1px' : '0'}; top: 0;`
		},
		{
			id: 'left',
			show: showLeft,
			showBorder: borderLeft,
			placement: 'left: 0;',
			size: `width: ${gradientExtent}px; top: ${topOffset}px; bottom: ${bottomOffset}px`,
			borderSide: 'border-left',
			borderStyle: 'position: absolute; left: 0; top: 0; height: 100%; width: 1px;',
			gradient: `linear-gradient(to right, ${gradientStops})`,
			mask: `linear-gradient(to bottom, ${maskBase})`,
			gradientStyle: `top: 0; bottom: 0; left: ${borderLeft ? '1px' : '0'}; right: 0;`
		},
		{
			id: 'right',
			show: showRight,
			showBorder: borderRight,
			placement: 'right: 0;',
			size: `width: ${gradientExtent}px; top: ${topOffset}px; bottom: ${bottomOffset}px`,
			borderSide: 'border-right',
			borderStyle: 'position: absolute; right: 0; top: 0; height: 100%; width: 1px;',
			gradient: `linear-gradient(to left, ${gradientStops})`,
			mask: `linear-gradient(to bottom, ${maskBase})`,
			gradientStyle: `top: 0; bottom: 0; right: ${borderRight ? '1px' : '0'}; left: 0;`
		}
	]);
</script>

<div class="scroll-edge {className}">
	{@render children?.()}

	{#each edges as edge (edge.id)}
		{#if edge.show}
			<div transition:fade={{ duration: 250 }} class="edge" style="{edge.placement} {edge.size}">
				{#if edge.showBorder}
					<div
						class="edge-border"
						style="{edge.borderStyle} {edge.borderSide}: {borderStyle};"
					></div>
				{/if}
				<div
					class="edge-gradient"
					style="position: absolute; {edge.gradientStyle} background: {edge.gradient}; mask-image: {edge.mask}; -webkit-mask-image: {edge.mask}; {maskSize}"
				></div>
			</div>
		{/if}
	{/each}
</div>

<style>
	.scroll-edge {
		position: relative;
		display: flex;
		min-height: 0;
		flex: 1;
		flex-direction: column;
		overflow: hidden;
	}

	.edge {
		position: absolute;
		pointer-events: none;
		z-index: 20;
	}

	.edge-border {
		background: transparent;
	}

	.edge-gradient {
		pointer-events: none;
	}
</style>
