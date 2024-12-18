<script lang="ts">
	import type { Snippet } from 'svelte';

	import { clickOutside } from '../../actions/click-outside';
	import Button from '../Button/Button.svelte';
	import type { ButtonProps } from '../Button/types';
	import Box from './Box.svelte';
	import TriggerStyler from './TriggerStyler.svelte';
	import type { PopupKind, TailPosition } from './types';

	type Props = {
		triggerType?: 'button' | 'dropdown';
		active?: boolean;
		kind?: PopupKind;
		customClass?: string;
		label: Snippet;
		content: Snippet;
		buttonProps?: ButtonProps;
		style?: string;
		position?: {
			x?: 'left' | 'center' | 'right';
			y?: 'top' | 'bottom';
		};
	};

	let {
		triggerType = 'dropdown',
		kind = 'form',
		customClass = '',
		active = $bindable(),
		label,
		content,
		buttonProps,
		style,
		position = {
			x: 'center',
			y: 'bottom'
		}
	}: Props = $props();

	let { x: horizontalPosition = 'center', y: verticalPosition = 'bottom' } = $derived(position);

	let tailPosition = $derived.by(getTailPosition);

	function onclick() {
		active = !active;
	}
	function onclickoutside() {
		active = false;
	}

	function getTailPosition() {
		const tailPosition: TailPosition = { x: 'center', y: 'top' };
		if (verticalPosition === 'top') {
			tailPosition.y = 'bottom';
		}
		if (horizontalPosition === 'left') {
			tailPosition.x = 'right';
		} else if (horizontalPosition === 'right') {
			tailPosition.x = 'left';
		}
		return tailPosition;
	}
</script>

<div class="popup-group global-reset-line-height {customClass}" use:clickOutside={onclickoutside}>
	{#if triggerType === 'button'}
		<Button {onclick} {active} imitatePressingOnClick={false} {...buttonProps}>
			{@render label()}
		</Button>
	{:else}
		<TriggerStyler {active}>
			<button class="global-reset-button global-reset-link global-dropdown-paddings" {onclick}>
				{@render label()}
			</button>
		</TriggerStyler>
	{/if}

	{#if active}
		<div
			class="popup-positioner vertical-{verticalPosition} horizontal-{horizontalPosition}"
			{style}
		>
			<Box {kind} {tailPosition}>
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
		width: max-content;
		z-index: 1;
	}

	.vertical-top {
		top: 0%;
	}
	.vertical-bottom {
		bottom: 0%;
	}
	.horizontal-left {
		right: 0%;
	}
	.horizontal-center {
		left: 50%;
	}
	.horizontal-right {
		left: 0%;
	}

	.vertical-top.horizontal-center {
		transform: translate(-50%, -100%);
	}
	.vertical-bottom.horizontal-center {
		transform: translate(-50%, 100%);
	}
	.vertical-top.horizontal-left {
		transform: translate(-100%, -100%);
	}
	.vertical-bottom.horizontal-left {
		transform: translate(0%, 100%);
	}
	.vertical-top.horizontal-right {
		transform: translate(0%, -100%);
	}
	.vertical-bottom.horizontal-right {
		transform: translate(0%, 100%);
	}
</style>
