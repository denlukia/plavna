<script lang="ts">
	import type { ArticleSelect, ImagesCollection } from '$lib/server/collections/types';
	import ImageCreationForm from './ImageCreationForm.svelte';
	import ImageUpdateForm from './ImageUpdateForm.svelte';

	export let collection: ImagesCollection;
	export let articleId: ArticleSelect['id'] | null = null;
</script>

<ImageCreationForm {articleId} />
{#each collection as image}
	<ImageUpdateForm {image} />
{/each}
