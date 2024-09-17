<script lang="ts">
	import type { ImagePathAndMeta } from '../../types';

	type Props = {
		pathAndMeta: ImagePathAndMeta;
		style?: string;
	};

	let { pathAndMeta, style = '' }: Props = $props();
</script>

<img
	class="image"
	style="--bg: {pathAndMeta.background}; {style}"
	src={pathAndMeta.src}
	alt={pathAndMeta.alt}
/>

<style>
	.image {
		background: var(--bg);
	}
</style>
