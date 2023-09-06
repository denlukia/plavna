<script lang="ts">
	import Translation from '$lib/components/Translation.svelte';

	import type { PageData } from '../../../routes/[[lang=lang]]/[username]/[slug]/$types';

	export let data: PageData;
</script>

<h1>
	<Translation key={data.article.title_translation_key} />
</h1>
<Translation key={data.article.content_translation_key} markdownMode />
<!-- {#if data.previewComponent}
	<svelte:component this={data.previewComponent} />
{:else}
	No preview
{/if} -->
