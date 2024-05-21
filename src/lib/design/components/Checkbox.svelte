<script lang="ts">
	import { untrack } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { tweened } from 'svelte/motion';

	import CheckMark from '../icons/CheckMark.svelte';
	import IconWrapper from '../icons/IconWrapper.svelte';
	import { createMouseWatcher } from '../reactivity/mouse-watcher.svelte';
	import LayerShift from './ActiveElementFX/LayerShift.svelte';

	let { type, checked, ...attributes }: HTMLInputAttributes = $props();

	const uncheckedStartingFrame = 0;
	const checkedFrame = 12;
	const uncheckedEndingFrame = 23;

	const checkMarkCurrentFrame = tweened(checked ? checkedFrame : uncheckedStartingFrame, {
		duration: 250
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

<label class="checkbox" {...events}>
	<input type="checkbox" bind:checked {...attributes} />
	<span class="checkbox-visualizer">
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
	.checkbox {
		position: relative;

		margin-top: var(--checkbox-margin-top);
		margin-bottom: var(--checkbox-margin-bottom);
	}
	input {
		appearance: none;
		position: absolute;
	}

	.checkbox-visualizer {
		position: relative;
		display: inline-block;
		background: var(--color-checkbox-bg);
		box-shadow: var(--shadow-checkbox);
		border-radius: var(--size-checkbox-border-radius);
		width: var(--size-checkbox);
		height: var(--size-checkbox);
		transition: var(--transition-checkbox);
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
