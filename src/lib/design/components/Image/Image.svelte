<script lang="ts">
	import type { ImagePathAndMeta } from '../../types';

	type Props = {
		pathAndMeta: ImagePathAndMeta;
	};

	let { pathAndMeta }: Props = $props();
</script>

<img class="image" src={pathAndMeta.src} alt={pathAndMeta.alt} />
