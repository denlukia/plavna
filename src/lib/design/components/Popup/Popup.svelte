<script lang="ts">
	import type { Snippet } from 'svelte';

	import { clickOutside } from '../../actions/click-outside';
	import Button from '../Button/Button.svelte';
	import type { ButtonProps } from '../Button/types';
	import Box from './Box.svelte';
	import TriggerStyler from './TriggerStyler.svelte';

	type Props = {
		triggerType?: 'button' | 'dropdown';
		active?: boolean;
		list?: boolean;
		label: Snippet;
		content: Snippet;
		buttonProps?: ButtonProps;
	};

	let {
		triggerType = 'dropdown',
		list,
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

<span class="popup-group global-reset-line-height" use:clickOutside={onclickoutside}>
	{#if triggerType === 'button'}
		<Button {onclick} {active} imitatePressingOnClick={false} {...buttonProps}
			>{@render label()}</Button
		>
	{:else}
		<TriggerStyler {active}>
			<button class="global-reset-button global-dropdown-paddings" {onclick}>
				{@render label()}
			</button>
		</TriggerStyler>
	{/if}

	{#if active}
		<div class="popup-positioner">
			<Box {list} popupForm={!list}>
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
