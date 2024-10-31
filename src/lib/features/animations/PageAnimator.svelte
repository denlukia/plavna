<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	type Props = Record<string, any> & {
		children: Snippet;
	};

	let { children, ...keys }: Props = $props();
</script>

{#key Object.values(keys || {}).join()}
	<div
		class="animation-wrapper"
		in:fly|global={{ duration: 400, delay: 200, y: 10, easing: cubicOut }}
		out:fly|global={{ duration: 400, y: -10, easing: cubicOut }}
	>
		{@render children()}
	</div>
{/key}
