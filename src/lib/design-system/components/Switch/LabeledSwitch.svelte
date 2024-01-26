<script lang="ts">
	import Text from '../Text.svelte';
	import type { TextSizes } from '../types';
	import Switch from './Switch.svelte';
	import type { SwitchProps } from './types';

	interface Props extends SwitchProps {
		labelBefore?: string;
		labelAfter?: string;
		textSize?: TextSizes;
	}
	let { labelBefore, labelAfter, textSize = 'body', ...props } = $props<Props>();
</script>

<!-- svelte-ignore a11y-label-has-associated-control -->
<label>
	{#if labelBefore}
		<Text size={textSize}>{labelBefore}</Text>
	{/if}
	<Switch {...props} />
	{#if labelAfter}
		<Text size={textSize}>{labelAfter}</Text>
	{/if}
</label>

<style>
</style>
