<script lang="ts">
	import { untrack } from 'svelte';
	import { linear } from 'svelte/easing';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { tweened } from 'svelte/motion';

	import CheckMark from '../../icons/CheckMark.svelte';
	import { createMouseWatcher } from '../../reactivity/mouse-watcher.svelte';
	import LayerShift from '../ActiveElementFX/LayerShift.svelte';
	import IconWrapper from '../IconWrapper/IconWrapper.svelte';

	type Props = HTMLInputAttributes & { checkboxSize?: 'default' | 'small' };

	let { type, checkboxSize = 'default', checked = $bindable(), ...attributes }: Props = $props();

	const uncheckedStartingFrame = 0;
	const checkedFrame = 12;
	const uncheckedEndingFrame = 23;
	const animationDuration = 170;

	const checkMarkCurrentFrame = tweened(checked ? checkedFrame : uncheckedStartingFrame, {
		duration: animationDuration,
		easing: linear
	});

	let { mouse, ...events } = createMouseWatcher();

	$effect(() => {
		if (checked) {
			checkMarkCurrentFrame.set(checkedFrame);
		} else {
			if (untrack(() => $checkMarkCurrentFrame) !== uncheckedStartingFrame) {
				checkMarkCurrentFrame.set(uncheckedEndingFrame).then(() => {
					checkMarkCurrentFrame.set(uncheckedStartingFrame, {
						duration: 0
					});
				});
			}
		}
	});
</script>

<label class="checkbox-label" {...events}>
	<input class="global-visually-hidden" type="checkbox" bind:checked {...attributes} />
	<span class="checkbox-visualizer size-{checkboxSize}">
		<div class="checkmark-positioner">
			<LayerShift {mouse}>
				<IconWrapper
					size="body-big"
					frameSize={20}
					frames={23}
					currentFrame={$checkMarkCurrentFrame}
				>
					<CheckMark />
				</IconWrapper>
			</LayerShift>
		</div>
	</span>
</label>

<style>
	.checkbox-label {
		display: inline-block;
		margin-top: var(--checkbox-margin-top);
		margin-bottom: var(--checkbox-margin-bottom);
	}

	.checkbox-visualizer {
		position: relative;
		display: inline-block;
		background: var(--color-checkbox-bg);
		box-shadow: var(--shadow-checkbox);

		transition: var(--transition-checkbox);
	}
	.size-default {
		width: var(--size-checkbox-default);
		height: var(--size-checkbox-default);
		border-radius: var(--size-checkbox-default-border-radius);
	}
	.size-small {
		width: var(--size-checkbox-small);
		height: var(--size-checkbox-small);
		border-radius: var(--size-checkbox-small-border-radius);
	}

	input:checked + .checkbox-visualizer {
		background: var(--color-checkbox-checked-bg);
		box-shadow: var(--shadow-checkbox-checked);
	}

	input:checked + .checkbox-visualizer:hover {
		transform: var(--transform-checkbox-checked-hover);
		box-shadow: var(--shadow-checkbox-checked-hover);
	}

	input:checked + .checkbox-visualizer:active {
		transform: var(--transform-checkbox-checked-active);
	}

	.checkmark-positioner {
		position: absolute;
		top: 40%;
		left: 65%;
		transform: translate(-50%, -50%);
	}
</style>
