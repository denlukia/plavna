<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLLabelAttributes } from 'svelte/elements';

	type Props = HTMLLabelAttributes & {
		children: Snippet;
		as?: 'label' | 'span' | 'div';
		type?: 'horizontal' | 'vertical' | 'switch-with-bg';
		href?: string;
	};

	let { children, as = 'label', type = 'vertical', href, ...attributes }: Props = $props();
</script>

<!-- svelte-ignore a11y_label_has_associated_control -->
<svelte:element
	this={href ? 'a' : as}
	class="labeled-input global-reset-line-height global-reset-link {type}"
	{href}
	{...attributes}
>
	{@render children()}
</svelte:element>

<style>
</style>
