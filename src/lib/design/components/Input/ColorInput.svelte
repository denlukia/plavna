<script lang="ts">
	import Input from './Input.svelte';
	import type { InputProps } from './types';

	let { value = $bindable(), ...other }: InputProps = $props();
</script>

<Input type="color" {...other} bind:value>
	{#snippet leading()}
		<span class="picker-wrapper">
			<input bind:value type="color" class="global-reset-input color-picker" />
		</span>
	{/snippet}
</Input>

<style>
	.picker-wrapper {
		display: flex;
		flex-shrink: 0;
		padding: var(--size-input-color-picker-wrapper-padding);
	}
  .color-picker {
		width: var(--size-input-color-picker);
		height: var(--size-input-color-picker);
		border: var(--border-input-color-picker);
		border-radius: var(--size-input-color-picker-radius);
		padding: 0;
		box-shadow: var(--shadow-input-color-picker);
	}
	.color-picker::-webkit-color-swatch-wrapper {
		padding: 0;
	}
</style>
