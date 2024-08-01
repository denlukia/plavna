<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { ArticleSelect } from '$lib/features/article/parsers';
	import type { ImageProviderUpdate } from '$lib/features/user/parsers';

	import type { ImagesCollection } from '../parsers';
	import ImageCreationForm from './ImageCreationForm.svelte';
	import ImageProviderWarning from './ImageProviderWarning.svelte';
	import ImageUpdateForm from './ImageUpdateForm.svelte';

	type Props = {
		imageProvider: {
			hasValidCredentialsSet: boolean;
			superValidated: SuperValidated<ImageProviderUpdate>;
		};
		articleId: ArticleSelect['id'];
		collections: {
			common: ImagesCollection;
			article: ImagesCollection;
		};
	};
	let { imageProvider, articleId, collections }: Props = $props();

	let { superValidated, hasValidCredentialsSet } = imageProvider;
</script>

<div class="images-block">
	{#if !hasValidCredentialsSet}
		<ImageProviderWarning {superValidated} />
	{:else}
		Common:
		<ImageCreationForm {articleId} isAccountCommon form={collections.common.creation} />
		{#each collections.common.items as image}
			<ImageUpdateForm {image} />
		{/each}

		Articles specific:
		<ImageCreationForm {articleId} form={collections.article.creation} />
		{#each collections.article.items as image}
			<ImageUpdateForm {image} />
		{/each}
	{/if}
</div>

<style>
	.images-block {
		background-color: var(--color-article-editor-images-block-bg);
		padding: var(--size-article-editor-images-block-padding);
		border-radius: var(--size-article-editor-images-block-border-radius);
	}
</style>
