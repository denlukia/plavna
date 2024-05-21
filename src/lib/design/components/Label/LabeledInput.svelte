<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLLabelAttributes } from 'svelte/elements';

	type Props = HTMLLabelAttributes & {
		children: Snippet;
		type?: 'horizontal' | 'vertical' | 'switch-with-bg';
	};

	let { children, type = 'vertical', ...attributes }: Props = $props();
</script>

<!-- svelte-ignore a11y_label_has_associated_control -->
<label class="global-reset-line-height {type}" {...attributes}>
	{@render children()}
</label>

<style>
	label {
		display: inline-flex;

		/* For Text */
		--text-padding-inline: var(--size-labeled-text-padding-inline);

		/* For Input */
		--input-margin-top: var(--size-labeled-input-margin-top);
		--input-margin-bottom: var(--size-labeled-input-margin-bottom);

		/* For Input Last Child */
		--input-last-child-margin-bottom: 0;

		/* For Checkbox */
		--checkbox-margin-top: var(--size-labeled-checkbox-margin-top);
		--checkbox-margin-bottom: var(--size-labeled-checkbox-margin-bottom);
	}
	.vertical {
		flex-direction: column;
	}

	.switch-with-bg {
		padding-inline: var(--size-labeled-switch-with-bg-padding-inline);
		background: var(--color-labeled-switch-with-bg-bg);
		border-radius: var(--size-labeled-switch-with-bg-border-radius);
		/* overflow: hidden; */

		/* For Switch */
		--switch-margin-top: var(--size-labeled-switch-with-bg-margin-top);

		/* For Text */
		--text-padding-inline: var(--size-labeled-switch-with-bg-text-padding-inline);
	}
</style>
