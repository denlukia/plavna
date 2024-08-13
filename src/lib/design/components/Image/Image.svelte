<script lang="ts">
	import type { ImagePathAndMeta } from '../../types';

	type Props = {
		pathAndMeta: ImagePathAndMeta;
	};

	let { pathAndMeta }: Props = $props();
</script>

<img
	class="image"
	style="--bg: {pathAndMeta.background}"
	src={pathAndMeta.src}
	alt={pathAndMeta.alt}
/>

<style>
	.image {
		background: var(--bg);
	}
</style>
