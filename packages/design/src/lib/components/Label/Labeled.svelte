<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLLabelAttributes } from 'svelte/elements';

	type Props = HTMLLabelAttributes & {
		children: Snippet;
		customClass?: string;
		as?: 'label' | 'span' | 'div' | 'legend';
		kind?: 'for-checkbox' | 'for-switch' | 'for-radiogroup' | 'for-radioinput';
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
	}
	.labeled.for-radiogroup {
		display: flex;
		flex-direction: column;
		gap: 0;
		margin-bottom: var(--size-s);

		--label-padding-inline: 0;
	}
	.labeled.for-radiogroup :global(.label:first-of-type) {
		margin-bottom: var(--size-xs);
	}
	.labeled.for-radioinput {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: var(--size-labeled-input-checkbox-wrapper-gap);
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
