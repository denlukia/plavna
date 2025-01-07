<script lang="ts">
	import Image from '@plavna/design/components/Image/Image.svelte';
	import { page } from '$app/stores';

	import { getImagePathAndMeta } from './utils';
	import type { ImageSelect } from './validators';

	type Props = {
		id: ImageSelect['id'];
	};

	let { id }: Props = $props();

	let preparedImage = $derived(
		getImagePathAndMeta(
			id,
			$page.data.user,
			$page.data.imagesState?.value,
			$page.data.recordsTranslationsState?.value
		)
	);
</script>

{#if preparedImage}
	<Image pathAndMeta={preparedImage} />
{/if}
