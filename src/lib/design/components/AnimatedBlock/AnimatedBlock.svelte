<script lang="ts">
	import type { Snippet } from 'svelte';
	import Layers from '$lib/design/components/ActiveElementFX/Layers.svelte';

	import Animated from './Animated.svelte';

	type Props = {
		key: any;
		children: Snippet;
		text?: boolean;
	};

	let { key, children, text }: Props = $props();
</script>

<Layers overflow="visible" inline>
	<Animated {key} animateIntroWithCss={false} global={false} {text}>
		{@render children()}
	</Animated>
</Layers>
