<script lang="ts">
	import type { Snippet } from 'svelte';

	import { clickoutside } from '../(helpers)/clickOutside';
	import Button from '../Button.svelte';
	import Box from './Box.svelte';
	import TriggerStyler from './TriggerStyler.svelte';

	type Props = {
		triggerType?: 'button' | 'dropdown';
		label: Snippet;
		content: Snippet;
		active?: boolean;
	};

	let { triggerType = 'dropdown', active = $bindable(), label, content }: Props = $props();

	function onclick() {
		active = !active;
	}
	function onclickoutside() {
		active = false;
	}
</script>

<span class="popup-group global-reset-line-height" use:clickoutside={onclickoutside}>
	{#if triggerType === 'button'}
		<Button {onclick} {active} imitatePressingOnClick={false}>{@render label()}</Button>
	{:else}
		<TriggerStyler {active}>
			<button class="global-reset-button global-dropdown-paddings" {onclick}>
				{@render label()}
			</button>
		</TriggerStyler>
	{/if}

	{#if active}
		<div class="popup-positioner">
			<Box>
				{@render content()}
			</Box>
		</div>
	{/if}
</span>

<style>
	.popup-group {
		position: relative;
	}
	.popup-positioner {
		position: absolute;
		bottom: 0%;
		left: 50%;
		width: max-content;
		max-width: 200px;
		transform: translate(-50%, 100%);
		z-index: 1;
	}
</style>
