<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { cubicOut } from 'svelte/easing';

	import { createMouseWatcher } from '../(helpers)/createMouseWatcher.svelte';
	import LayerFlashlight from '../(helpers)/LayerFlashlight.svelte';
	import Layers from '../(helpers)/Layers.svelte';
	import { crossfade } from './crossfade';

	// TODO Fix animation on first switching

	type Props = {
		children: Snippet;
		size?: 'body' | 'small' | 'heading-2';
	};

	let { children, size = 'body' }: Props = $props();

	let { mouse, ...events } = createMouseWatcher();

	let ref: HTMLSpanElement | null = $state(null);
	let mutationObserver: MutationObserver | null = $state(null);
	let resizeObserver: ResizeObserver | null = $state(null);

	let pillActive = $state(false);
	let pillPos = $state({ left: 0, top: 0, right: 0, bottom: 0 });
	let pillSkipTransition = $state(false);

	const pillAnimDuration = 450;
	let [send, receive] = crossfade({ easing: cubicOut });

	function mutationCallback(mutation: MutationRecord[]) {
		const activeTabMutations = mutation.filter(
			(m) => m.type === 'attributes' && m.attributeName === 'data-active-tab'
		);
		const targets = activeTabMutations.map((m) => m.target as HTMLButtonElement);
		const activeTab = findActiveTab(targets);
		if (!activeTab) return;
		pillPos = getPillRelativePositionFromNode(activeTab);
	}

	function findActiveTab(nodes: Element[]) {
		return nodes.find((node) => node.matches('[data-active-tab="true"]'));
	}

	function getPillRelativePositionFromNode(node: Element) {
		if (!ref) return { left: 0, top: 0, right: 0, bottom: 0 };
		const refRect = ref.getBoundingClientRect();
		const rect = node.getBoundingClientRect();
		const relativePos = {
			left: rect.left - refRect.left,
			top: rect.top - refRect.top,
			right: refRect.right - rect.right,
			bottom: refRect.bottom - rect.bottom
		};
		return relativePos;
	}

	function findActiveTabAndSetPillPos(ref: HTMLSpanElement) {
		const activeTab = findActiveTab(Array.from(ref.children));
		if (!activeTab) return;
		pillPos = getPillRelativePositionFromNode(activeTab);
	}

	onMount(() => {
		if (!ref) return;

		findActiveTabAndSetPillPos(ref);

		if (!('MutationObserver' in window)) return;

		mutationObserver = new MutationObserver(mutationCallback);
		mutationObserver.observe(ref, { attributes: true, subtree: true });
		pillActive = true;

		resizeObserver = new ResizeObserver(() => {
			if (!ref) return;
			pillSkipTransition = true;
			findActiveTabAndSetPillPos(ref);
			setTimeout(() => (pillSkipTransition = false), 0);
		});
		resizeObserver.observe(ref);

		return () => {
			mutationObserver?.disconnect();
			resizeObserver?.disconnect();
		};
	});
</script>

<!-- svelte-ignore a11y-interactive-supports-focus a11y-click-events-have-key-events -->
<div
	class="tabs global-fix-overflow global-text-{size}"
	role="tablist"
	class:pill-active={pillActive}
	{...events}
>
	<Layers>
		<LayerFlashlight {mouse} />
		{#if pillActive}
			{#key pillPos.left}
				<div
					out:send={{ key: 'pill', duration: pillSkipTransition ? 0 : pillAnimDuration }}
					in:receive={{ key: 'pill', duration: pillSkipTransition ? 0 : pillAnimDuration }}
					class="active-tab-pill"
					class:skip-transition={pillSkipTransition}
					style="left: {pillPos.left}px; top: {pillPos.top}px; right: {pillPos.right}px; bottom: {pillPos.bottom}px"
				/>
			{/key}
		{/if}
		<span class="tab-items-wrapper" bind:this={ref}>
			{@render children()}
		</span>
	</Layers>
</div>

<style>
	/* General */
	.tabs {
		background: var(--color-tabs-bg);
		box-shadow: var(--shadow-tabs);
		overflow: hidden;

		/* For LayerFlashlight */
		--color-layer-flashlight-pointer: var(--color-tabs-layer-flashlight-hover);

		/* For TabItem */
		--active-tab-item-background: var(--color-tab-item-active-bg);
		--active-tab-item-box-shadow: var(--shadow-tab-item-active);
	}

	.tab-items-wrapper {
		display: flex;
	}

	.tabs.pill-active {
		--active-tab-item-background: unset;
		--active-tab-item-box-shadow: unset;
	}

	.active-tab-pill {
		position: absolute;
		background: var(--color-tab-item-active-bg);
		box-shadow: var(--shadow-tab-item-active);
	}

	/* --- Size-dependent --- */
	/* Size Heading-2 */
	.tabs.global-text-heading-2 {
		border-radius: var(--size-tabs-heading-2-border-radius);
		padding: var(--size-tabs-heading-2-padding);

		/* For Layers */
		--layers-border-radius: var(--size-tabs-heading-2-border-radius);

		/* For TabItems */
		--tab-item-padding-top: var(--size-tab-item-heading-2-padding-top);
		--tab-item-padding-bottom: var(--size-tab-item-heading-2-padding-bottom);
		--tab-item-padding-inline: var(--size-tab-item-heading-2-padding-inline);

		/* For Active TabItem */
		--active-tab-item-border-radius: var(--size-tab-item-active-heading-2-border-radius);

		/* For Text component inside TabItems */
		--text-font-family: var(--text-heading-2-font-family);
		--text-padding-top: var(--text-heading-2-padding-top);
		--text-padding-bottom: var(--text-heading-2-padding-bottom);
		--text-font-size: var(--text-heading-2-font-size);
		--text-font-weight: var(--text-heading-2-font-weight);
		--text-line-height: var(--text-heading-2-line-height);
		--text-letter-spacing: var(--text-heading-2-letter-spacing);
	}

	.tabs.global-text-heading-2 .active-tab-pill {
		border-radius: var(--size-tab-item-active-heading-2-border-radius);
	}

	/* Size Body */
	.tabs.global-text-body {
		border-radius: var(--size-tabs-body-border-radius);
		padding: var(--size-tabs-body-padding);

		/* For Layers */
		--layers-border-radius: var(--size-tabs-body-border-radius);

		/* For TabItems */
		--tab-item-padding-top: var(--size-tab-item-body-padding-top);
		--tab-item-padding-bottom: var(--size-tab-item-body-padding-bottom);
		--tab-item-padding-inline: var(--size-tab-item-body-padding-inline);

		/* For Active TabItem */
		--active-tab-item-border-radius: var(--size-tab-item-active-body-border-radius);

		/* For Text component inside TabItems */
		--text-font-family: var(--text-body-font-family);
		--text-padding-top: var(--text-body-padding-top);
		--text-padding-bottom: var(--text-body-padding-bottom);
		--text-font-size: var(--text-body-font-size);
		--text-font-weight: var(--text-body-font-weight);
		--text-line-height: var(--text-body-line-height);
		--text-letter-spacing: var(--text-body-letter-spacing);
	}

	.tabs.global-text-body .active-tab-pill {
		border-radius: var(--size-tab-item-active-body-border-radius);
	}

	/* Size Small */
	.tabs.global-text-small {
		border-radius: var(--size-tabs-small-border-radius);
		padding: var(--size-tabs-small-padding);

		/* For Layers */
		--layers-border-radius: var(--size-tabs-small-border-radius);

		/* For TabItems */
		--tab-item-padding-top: var(--size-tab-item-small-padding-top);
		--tab-item-padding-bottom: var(--size-tab-item-small-padding-bottom);
		--tab-item-padding-inline: var(--size-tab-item-small-padding-inline);

		/* For Active TabItem */
		--active-tab-item-border-radius: var(--size-tab-item-active-small-border-radius);

		/* For Text component inside TabItems */
		--text-font-family: var(--text-small-font-family);
		--text-padding-top: var(--text-small-padding-top);
		--text-padding-bottom: var(--text-small-padding-bottom);
		--text-font-size: var(--text-small-font-size);
		--text-font-weight: var(--text-small-font-weight);
		--text-line-height: var(--text-small-line-height);
		--text-letter-spacing: var(--text-small-letter-spacing);
	}

	.tabs.global-text-small .active-tab-pill {
		border-radius: var(--size-tab-item-active-small-border-radius);
	}
</style>
