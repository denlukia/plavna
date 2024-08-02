<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import TabItem from '$lib/design/components/Tabs/TabItem.svelte';
	import Tabs from '$lib/design/components/Tabs/Tabs.svelte';
	import Typography from '$lib/design/components/Typography/Typography.svelte';
	import type { ArticleSelect } from '$lib/features/article/parsers';
	import Translation from '$lib/features/i18n/Translation.svelte';
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

	let commonShown = $state(true);
	let collection = $derived(commonShown ? collections.common : collections.article);
</script>

<div class="images-block">
	<header class="header">
		<Typography size="heading-2">
			<Translation key="article_editor.images.label" />
		</Typography>
		<Tabs size="small">
			<TabItem active={commonShown} onclick={() => (commonShown = true)}>
				<Translation key="article_editor.images.account_common" />
			</TabItem>
			<TabItem active={!commonShown} onclick={() => (commonShown = false)}>
				<Translation key="article_editor.images.article_specific" />
			</TabItem>
		</Tabs>
	</header>

	{#if !hasValidCredentialsSet}
		<ImageProviderWarning {superValidated} />
	{:else}
		<ImageCreationForm
			{articleId}
			isAccountCommon={commonShown}
			superValidated={collection.creation}
		/>
		{#each collection.items as image}
			<ImageUpdateForm {image} />
		{/each}
	{/if}
</div>

<style>
	.images-block {
		background-color: var(--color-article-editor-images-block-bg);
		padding: var(--size-article-editor-images-block-padding);
		border-radius: var(--size-article-editor-images-block-border-radius);
		width: 100%;
	}
	.header {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
	}
</style>
