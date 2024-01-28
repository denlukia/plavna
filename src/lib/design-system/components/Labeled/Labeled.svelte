<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		type?: 'horizontal' | 'vertical' | 'switch-with-bg';
	};

	let { children, type = 'horizontal' } = $props<Props>();
</script>

<!-- svelte-ignore a11y-label-has-associated-control -->
<label class="global-line-height-reset {type}">
	{@render children()}
</label>

<style>
	label {
		display: flex;
	}
	.vertical {
		flex-direction: column;
	}
	.switch-with-bg {
		padding-inline: var(--size-labeled-switch-with-bg-padding-inline);
		background: var(--color-labeled-switch-with-bg-bg);
		border-radius: var(--size-labeled-switch-with-bg-border-radius);
		overflow: hidden;
	}
	.switch-with-bg > :global(.switch) {
		margin-top: var(--size-labeled-switch-with-bg-margin-top);
	}
	.switch-with-bg > :global(.text) {
		padding-inline: var(--size-labeled-switch-with-bg-text-padding-inline);
	}

	label > :global(.text) {
		padding-inline: var(--size-labeled-text-padding-inline);
	}
	label > :global(.input-with-actions) {
		margin-top: var(--size-labeled-input-margin-top);
		margin-bottom: var(--size-labeled-input-margin-bottom);
		transition: var(--transition-labeled-input);
	}
	label > :global(.input-with-actions:last-child) {
		margin-bottom: 0;
	}
</style>
