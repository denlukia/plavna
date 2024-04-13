<script lang="ts">
	import Translation from '$lib/features/i18n/Translation.svelte';

	let { data } = $props();
</script>

<h1>
	<Translation recordKey={data.article.title_translation_key} />
</h1>
<Translation recordKey={data.article.content_translation_key} markdownMode />
<!-- {#if data.previewComponent}
	<svelte:component this={data.previewComponent} />
{:else}
	No preview
{/if} -->
