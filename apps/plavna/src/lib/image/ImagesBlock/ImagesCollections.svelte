<script lang="ts">
	import { Column, TabItem, Tabs, Typography } from '@plavna/design/components';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { ArticleSelect } from '$lib/article/validators';
	import SideBox from '$lib/common/components/SideBox.svelte';
	import Translation from '$lib/i18n/Translation.svelte';
	import type { ImageProviderUpdate } from '$lib/user/validators';

	import type { ImagesCollection } from '../validators';
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

	let { superValidated, hasValidCredentialsSet } = $derived(imageProvider);

	let commonShown = $state(false);
	let collection = $derived(commonShown ? collections.common : collections.article);
</script>

<SideBox>
	{#snippet headerLeading()}
		<Typography size="heading-2">
			<Translation key="article_editor.images.label" />
		</Typography>

		<ImageCreationForm
			articleId={commonShown ? null : articleId}
			superValidated={collection.creation}
		/>
	{/snippet}
	{#snippet headerTrailing()}
		<Tabs size="small">
			<TabItem active={!commonShown} onclick={() => (commonShown = false)}>
				<Translation key="article_editor.images.article_specific" />
			</TabItem>
			<TabItem active={commonShown} onclick={() => (commonShown = true)}>
				<Translation key="article_editor.images.account_common" />
			</TabItem>
		</Tabs>
	{/snippet}

	{#snippet content()}
		{#if !hasValidCredentialsSet}
			<ImageProviderWarning {superValidated} />
		{:else}
			<div class="list-wrapper">
				{#each collection.items as image (image.meta.id)}
					<Column cols={1}>
						<div class="image-form-wrapper">
							<ImageUpdateForm {image} />
						</div>
					</Column>
				{/each}
			</div>
		{/if}
	{/snippet}
</SideBox>

<style>
	.list-wrapper {
		display: flex;
		gap: var(--size-m);
		align-items: stretch;
		flex-wrap: wrap;
	}
	.image-form-wrapper {
		width: 100%;
		margin-bottom: var(--size-xl);
	}
</style>
