<script lang="ts">
	import Translation from '$lib/features/i18n/Translation.svelte';

	import type { PageData } from '../[articleslug=articleslug]/$types';

	type Props = {
		data: PageData;
	};

	let { data }:Props = $props();
</script>

<h1>
	<Translation recordKey={data.article.title_translation_key} />
</h1>
<Translation recordKey={data.article.content_translation_key} markdown />
<!-- {#if data.previewComponent}
	<svelte:component this={data.previewComponent} />
{:else}
	No preview
{/if} -->
