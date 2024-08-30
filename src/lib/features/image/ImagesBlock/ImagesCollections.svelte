<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import Column from '$lib/design/components/Grid/Column.svelte';
	import TabItem from '$lib/design/components/Tabs/TabItem.svelte';
	import Tabs from '$lib/design/components/Tabs/Tabs.svelte';
	import Typography from '$lib/design/components/Typography/Typography.svelte';
	import type { ArticleSelect } from '$lib/features/article/parsers';
	import SideBox from '$lib/features/common/components/SideBox.svelte';
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
	.leading {
		display: flex;
		align-items: center;
		gap: var(--size-m);
	}

	.list-wrapper {
		display: flex;
		gap: var(--size-m);
		align-items: stretch;
		flex-wrap: wrap;
	}
	.image-form-wrapper {
		margin-bottom: var(--size-xl);
	}
</style>
