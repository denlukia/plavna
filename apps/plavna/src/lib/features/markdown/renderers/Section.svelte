<script lang="ts">
	import type { Snippet } from 'svelte';

	import { setSectionContext } from './section-context';

	type Props = {
		children: Snippet;
	};

	let { children }: Props = $props();

	setSectionContext({ section: true });
</script>

<section class="section global-text-aesthetic-small">
	{@render children()}
</section>

<style>
	.section {
		margin-top: var(--size-xl);
		/* border-top: 0.25px solid currentColor; */
	}
</style>
