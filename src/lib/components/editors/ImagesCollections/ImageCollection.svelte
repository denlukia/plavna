<script lang="ts">
	import type { ArticleSelect, ImagesCollection } from '$lib/server/collections/types';
	import ImageCreationForm from './ImageCreationForm.svelte';
	import ImageUpdateForm from './ImageUpdateForm.svelte';

	export let collection: ImagesCollection;
	export let articleId: ArticleSelect['id'] | null = null;
	export let isAccountCommon = false;
</script>

<ImageCreationForm {articleId} {isAccountCommon} form={collection.creation} />
{#each collection.items as image}
	<ImageUpdateForm {image} />
{/each}
