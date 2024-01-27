<script lang="ts">
	import Text from '../Text.svelte';
	import type { TextSizes } from '../types';
	import Switch from './Switch.svelte';
	import type { SwitchProps } from './types';

	interface Props extends SwitchProps {
		labelBefore?: string;
		labelAfter?: string;
		textSize?: TextSizes;
		withBg?: boolean;
	}
	let { labelBefore, labelAfter, textSize = 'body', withBg, ...props } = $props<Props>();
</script>

<!-- svelte-ignore a11y-label-has-associated-control -->
<label class="labeled-switch global-line-height-reset size-{textSize}" class:with-bg={withBg}>
	{#if labelBefore}
		<span class="text-aligner">
			<Text size={textSize}>{labelBefore}</Text>
		</span>
	{/if}
	<span class="switch-aligner">
		<Switch {...props} />
	</span>
	{#if labelAfter}
		<span class="text-aligner">
			<Text size={textSize}>{labelAfter}</Text>
		</span>
	{/if}
</label>

<style>
	.labeled-switch {
		display: inline-flex;
		padding-inline: var(--size-labeled-switch-padding-inline);
		border-radius: var(--size-labeled-switch-border-radius);
	}

	.with-bg {
		background: var(--color-labeled-switch-bg);
	}

	.size-heading-2 .switch-aligner {
		padding-top: var(--size-labeled-switch-aligner-padding-top);
	}

	.text-aligner {
		padding-inline: var(--size-labeled-switch-text-aligner-padding-inline);
	}
</style>
