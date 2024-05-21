<script lang="ts">
	import type { PreparedImage } from '../types';

	type Props = {
		preparedImage: PreparedImage;
	};

	let { preparedImage }: Props = $props();
</script>

<img src={preparedImage.src} alt={preparedImage.alt} />
