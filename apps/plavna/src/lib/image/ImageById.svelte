<script lang="ts">
	import { ImageCDN } from '@plavna/design/components';
	import { page } from '$app/stores';

	import { getImagePathAndMeta } from './utils';
	import type { ImageSelect } from './validators';

	type Props = {
		id: ImageSelect['id'];
		flexibleHeight?: boolean;
	};

	let { id, flexibleHeight }: Props = $props();

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
	<ImageCDN pathAndMeta={preparedImage} {flexibleHeight} />
{/if}
