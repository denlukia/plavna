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
		as = 'label',
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
	class="global-labeled-input-wrapper size-{size} {customClass} {kind || ''} {href
		? 'global-reset-link'
		: ''}"
	{href}
	{...attributes}
>
	{@render children()}
</svelte:element>
