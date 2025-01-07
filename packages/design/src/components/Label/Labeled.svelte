<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLLabelAttributes } from 'svelte/elements';

	type Props = HTMLLabelAttributes & {
		children: Snippet;
		customClass?: string;
		as?: 'label' | 'span' | 'div';
		kind?: 'for-checkbox' | 'for-switch';
		size?: 'body' | 'small';
		href?: string;
	};

	let {
		children,
		as = 'div',
		size = 'body',
		customClass = '',
		href,
		kind,
		...attributes
	}: Props = $props();
</script>

<!-- svelte-ignore a11y_label_has_associated_control -->
<svelte:element
	this={href ? 'a' : as}
	class="labeled size-{size} {customClass} {kind || ''} {href ? 'global-reset-link' : ''}"
	{href}
	{...attributes}
>
	{@render children()}
</svelte:element>

<style>
	.labeled.for-checkbox {
		align-items: flex-end;
		flex-direction: row;
		gap: var(--size-labeled-input-checkbox-wrapper-gap);

		/* For Checkbox */
	}
	.labeled.for-checkbox.size-body {
		--checkbox-margin-top: var(--size-labeled-checkbox-body-margin-top);
		--checkbox-margin-bottom: var(--size-labeled-checkbox-body-margin-bottom);
	}
	.labeled.for-checkbox.size-small {
		--checkbox-margin-top: var(--size-labeled-checkbox-small-margin-top);
		--checkbox-margin-bottom: var(--size-labeled-checkbox-small-margin-bottom);
	}
	.labeled.for-switch {
		flex-direction: row;
		width: auto;
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
