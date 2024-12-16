<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		children?: Snippet;
		class?: string;
	};

	const hiddenClasses = ['katex-html'];

	let { children, class: className }: Props = $props();
</script>

{#if !hiddenClasses.some((c) => className?.includes(c))}
	<span class="span {className}">
		{@render children?.()}
	</span>
{/if}
