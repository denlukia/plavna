<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	import Text from '$lib/design-system/components/Text.svelte';

	type Props = HTMLButtonAttributes & {
		children: Snippet;
		active?: boolean;
		size: 'body' | 'small';
	};

	let { children, active = false, size = 'body', ...attributes } = $props<Props>();
</script>

<button
	class="tab-item global-fix-overflow global-button-reset"
	class:active
	role="tab"
	{...attributes}
>
	<Text size="{size}-short">
		{@render children()}
	</Text>
</button>

<style>
	.tab-item {
	}
	.active {
		background: var(--color-tab-item-active-bg);
		box-shadow: var(--shadow-tab-item-active);
	}
</style>
