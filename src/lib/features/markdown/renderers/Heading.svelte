<script lang="ts">
	import type { Tokens } from 'marked';
	import type { Snippet } from 'svelte';
	import Typography from '$lib/design-system/components/Typography/Typography.svelte';

	type Props = Omit<Tokens.Heading, 'type'> & {
		children: Snippet;
	};

	let { children, depth }: Props = $props();

	let size = $derived.by(() => {
		if (depth === 1) {
			return 'heading-1' as const;
		} else if (depth === 2) {
			return 'heading-2' as const;
		} else {
			return 'headline' as const;
		}
	});
</script>

<Typography {size}>
	{@render children()}
</Typography>
