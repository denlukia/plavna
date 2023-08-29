<script lang="ts">
	import T from '$lib/components/Translation.svelte';

	import type { PageData } from '../../../routes/[[lang=lang]]/[username]/[slug]/$types';

	export let data: PageData;
</script>

<h1>
	<T key={data.post.title_translation_id} />
</h1>
<T key={data.post.content_translation_id} markdownMode />
{#if data.previewComponent}
	<svelte:component this={data.previewComponent} />
{:else}
	No preview
{/if}
