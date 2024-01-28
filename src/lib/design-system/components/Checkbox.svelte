<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import IconWrapper from './(icons)/IconWrapper.svelte';
	import CheckMark from './(icons)/CheckMark.svelte';
	import { tweened } from 'svelte/motion';

	let { type, ...attributes } = $props<HTMLInputAttributes>();

	let checkMarkPlayhead = tweened(0.5);
</script>

<!-- svelte-ignore a11y-label-has-associated-control -->
<label class="checkbox">
	<input type="checkbox" {...attributes} />
	<span class="checkbox-visualizer">
		<div class="checkmark-positioner">
			<IconWrapper size="body-big" frameSize={20} frames={23} playhead={0.5}>
				<CheckMark />
			</IconWrapper>
		</div>
	</span>
</label>

<style>
	label {
		position: relative;
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
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>
