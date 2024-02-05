<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount, type Snippet } from 'svelte';
	import { MouseWatcher } from '../Layers/watcher.svelte';
	import Layers from '../Layers/Layers.svelte';
	import LayerFlashlight from '../Layers/LayerFlashlight.svelte';

	type Props = {
		children: Snippet;
		size?: 'body' | 'small';
	};

	let { children, size = 'body' } = $props<Props>();

	let { mouse, ...events } = new MouseWatcher();

	let ref: HTMLSpanElement | null = $state(null);
	let mutationObserver: MutationObserver | null = $state(null);

	let pillActive = $state(false);
	let pillPos = $state({ left: 0, top: 0, width: 0, height: 0 });

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
		if (!ref) return { left: 0, top: 0, width: 0, height: 0 };
		const refRect = ref.getBoundingClientRect();
		const rect = node.getBoundingClientRect();
		const relativePos = {
			left: rect.left - refRect.left,
			top: rect.top - refRect.top,
			width: rect.width,
			height: rect.height
		};
		return relativePos;
	}

	onMount(() => {
		if (!ref) return;

		const activeTab = findActiveTab(Array.from(ref.children));
		if (!activeTab) return;
		pillPos = getPillRelativePositionFromNode(activeTab);

		if (!('MutationObserver' in window)) return;

		mutationObserver = new MutationObserver(mutationCallback);
		mutationObserver.observe(ref, { attributes: true, subtree: true });
		pillActive = true;
		return () => {
			mutationObserver?.disconnect();
		};
	});

	$inspect(pillActive);
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
			<div
				class="active-tab-pill"
				style="--left: {pillPos.left}px; --top: {pillPos.top}px; width: {pillPos.width}px; height: {pillPos.height}px"
			/>
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
		--color-layer-flashlight-hover: var(--color-tabs-layer-flashlight-hover);
	}

	.tab-items-wrapper {
		display: flex;
	}

	.tabs :global(.tab-item.active) {
		background: var(--color-tab-item-active-bg);
		box-shadow: var(--shadow-tab-item-active);
	}

	.tabs.pill-active :global(.tab-item.active) {
		background: unset;
		box-shadow: unset;
	}

	.active-tab-pill {
		position: absolute;
		background: var(--color-tab-item-active-bg);
		box-shadow: var(--shadow-tab-item-active);
		transition: all 200ms ease-out;
		top: 0;
		left: 0;
		transform: translate(var(--left), var(--top));
	}

	/* Size-dependent */
	.tabs.global-text-body {
		border-radius: var(--size-tabs-body-border-radius);
		padding: var(--size-tabs-body-padding);

		/* For Text component inside TabItems */
		--text-font-family: var(--text-body-font-family);
		--text-padding-top: var(--text-body-padding-top);
		--text-padding-bottom: var(--text-body-padding-bottom);
		--text-font-size: var(--text-body-font-size);
		--text-font-weight: var(--text-body-font-weight);
		--text-line-height: var(--text-body-line-height);
		--text-letter-spacing: var(--text-body-letter-spacing);
	}
	.tabs.global-text-small {
		border-radius: var(--size-tabs-small-border-radius);
		padding: var(--size-tabs-small-padding);

		/* For Text component inside TabItems */
		--text-font-family: var(--text-small-font-family);
		--text-padding-top: var(--text-small-padding-top);
		--text-padding-bottom: var(--text-small-padding-bottom);
		--text-font-size: var(--text-small-font-size);
		--text-font-weight: var(--text-small-font-weight);
		--text-line-height: var(--text-small-line-height);
		--text-letter-spacing: var(--text-small-letter-spacing);
	}
	.tabs.global-text-body :global(.tab-item) {
		padding-top: var(--size-tab-item-body-padding-top);
		padding-bottom: var(--size-tab-item-body-padding-bottom);
		padding-inline: var(--size-tab-item-body-padding-inline);
	}
	.tabs.global-text-body :global(.tab-item.active) {
		border-radius: var(--size-tab-item-active-body-border-radius);
	}
	.tabs.global-text-small :global(.tab-item) {
		padding-top: var(--size-tab-item-small-padding-top);
		padding-bottom: var(--size-tab-item-small-padding-bottom);
		padding-inline: var(--size-tab-item-small-padding-inline);
	}
	.tabs.global-text-small :global(.tab-item.active) {
		border-radius: var(--size-tab-item-active-small-border-radius);
	}

	.tabs.global-text-body .active-tab-pill {
		border-radius: var(--size-tab-item-active-body-border-radius);
	}
	.tabs.global-text-small .active-tab-pill {
		border-radius: var(--size-tab-item-active-small-border-radius);
	}
</style>
