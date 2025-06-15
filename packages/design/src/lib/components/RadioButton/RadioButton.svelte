<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	type Props = HTMLInputAttributes & {
		group: string | undefined;
	};

	let { group = $bindable(), ...attributes }: Props = $props();
</script>

<input type="radio" {...attributes} bind:group />
