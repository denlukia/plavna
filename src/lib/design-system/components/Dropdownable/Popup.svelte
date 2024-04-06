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
		opened?: boolean;
		closeOnClickInside?: boolean;
	};

	let { triggerType = 'dropdown', opened, label, content }: Props = $props();

	function onclick() {
		opened = !opened;
	}
	function onclickoutside() {
		opened = false;
	}
</script>

<span class="popup-group global-reset-line-height" use:clickoutside={onclickoutside}>
	{#if triggerType === 'button'}
		<Button {onclick} isActive={opened} imitatePressingOnClick={false}>{@render label()}</Button>
	{:else}
		<TriggerStyler isActive={opened}>
			<button class="global-reset-button global-dropdown-paddings" {onclick}>
				{@render label()}
			</button>
		</TriggerStyler>
	{/if}

	{#if opened}
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
