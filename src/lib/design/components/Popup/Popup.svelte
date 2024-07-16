<script lang="ts">
	import type { Snippet } from 'svelte';

	import { clickOutside } from '../../actions/click-outside';
	import Button from '../Button/Button.svelte';
	import type { ButtonProps } from '../Button/types';
	import Box from './Box.svelte';
	import TriggerStyler from './TriggerStyler.svelte';
	import type { PopupKind } from './types';

	type Props = {
		triggerType?: 'button' | 'dropdown';
		active?: boolean;
		kind?: PopupKind;
		label: Snippet;
		content: Snippet;
		buttonProps?: ButtonProps;
	};

	let {
		triggerType = 'dropdown',
		kind = 'form',
		active = $bindable(),
		label,
		content,
		buttonProps
	}: Props = $props();

	function onclick() {
		active = !active;
	}
	function onclickoutside() {
		active = false;
	}
</script>

<div class="popup-group global-reset-line-height" use:clickOutside={onclickoutside}>
	{#if triggerType === 'button'}
		<Button {onclick} {active} imitatePressingOnClick={false} {...buttonProps}>
			{@render label()}
		</Button>
	{:else}
		<TriggerStyler {active}>
			<button class="global-reset-button global-dropdown-paddings" {onclick}>
				{@render label()}
			</button>
		</TriggerStyler>
	{/if}

	{#if active}
		<div class="popup-positioner">
			<Box {kind}>
				{@render content()}
			</Box>
		</div>
	{/if}
</div>

<style>
	.popup-group {
		position: relative;
		width: fit-content;
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
