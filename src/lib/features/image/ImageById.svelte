<script lang="ts">
	import { page } from '$app/stores';
	import Image from '$lib/design/components/Image/Image.svelte';

	import type { ImageSelect } from './parsers';
	import { getImagePathAndMeta } from './utils';

	type Props = {
		id: ImageSelect['id'];
	};

	let { id }: Props = $props();

	let preparedImage = $derived(
		getImagePathAndMeta(id, $page.data.user, $page.data.images, $page.data.recordsTranslations)
	);
</script>

{#if preparedImage}
	<Image pathAndMeta={preparedImage} />
{/if}
