<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { ArticleSelect } from '$lib/features/article/parsers';
	import type { ImageProviderUpdate } from '$lib/features/user/parsers';

	import type { ImagesCollection } from '../parsers';
	import ImageCollection from './ImageCollection.svelte';
	import ImageProviderForm from './ImageProviderForm.svelte';

	export let providerForm: SuperValidated<ImageProviderUpdate>;
	export let articleId: ArticleSelect['id'];
	export let collections: {
		common: ImagesCollection;
		article: ImagesCollection;
	};
</script>

<div class="images-block">
	<ImageProviderForm {providerForm} />

	<!-- <ImageCollection collection={collections.common} isAccountCommon /> -->
</div>

<style>
	.images-block {
		background-color: var(--color-article-editor-images-block-bg);
		padding-inline: var(--size-article-editor-images-block-padding-inline);
		padding-block-start: var(--size-article-editor-images-block-padding-block-start);
		padding-block-end: var(--size-article-editor-images-block-padding-block-end);
		border-radius: var(--size-article-editor-images-block-border-radius);
	}
</style>
