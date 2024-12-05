<script lang="ts">
	import type { Snippet } from 'svelte';
	import Layers from '$lib/design/components/ActiveElementFX/Layers.svelte';

	import Animator from './Animated.svelte';

	type Props = {
		key: any;
		children: Snippet;
		text?: boolean;
	};

	let { key, children, text }: Props = $props();
</script>

<Layers overflow="visible" inline>
	<Animator {key} animateIntroWithCss={false} global={false} {text}>
		{@render children()}
	</Animator>
</Layers>
