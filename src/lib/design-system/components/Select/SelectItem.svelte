<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLOptionAttributes } from 'svelte/elements';

	type Props = HTMLOptionAttributes & {
		children: Snippet;
	};

	let { children, ...attributes } = $props<Props>();
</script>

<option {...attributes}>{@render children()}</option>
