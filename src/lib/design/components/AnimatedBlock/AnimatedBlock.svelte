<script lang="ts">
	import type { Snippet } from 'svelte';
	import Layers from '$lib/design/components/ActiveElementFX/Layers.svelte';

	import Animator from './Animated.svelte';

	type Props = {
		key: any;
		children: Snippet;
	};

	let { key, children }: Props = $props();
</script>

<Layers overflow="visible" inline>
	<Animator {key} animateIntroWithCss={false} global={false}>
		{@render children()}
	</Animator>
</Layers>
