<script lang="ts">
	import Label from '@plavna/design/components/Label/Label.svelte';
	import Labeled from '@plavna/design/components/Label/Labeled.svelte';
	import Typography from '@plavna/design/components/Typography/Typography.svelte';
	import type { ArticleService } from '$lib/features/article/service';
	import type { ExtractMethods } from '$lib/features/common/types';

	import SideBox from '../common/components/SideBox.svelte';
	import Translation from '../i18n/Translation.svelte';
	import ArticleTag from './ArticleTag.svelte';
	import ArticleTagCreator from './ArticleTagForm.svelte';

	type ArticleEditorData = Awaited<ReturnType<ExtractMethods<ArticleService>['loadEditor']>>;

	type Props = {
		tags: ArticleEditorData['tagInfos'];
		tagCreationSuperValidated: ArticleEditorData['tagCreationSuperValidated'];
	};

	let { tags, tagCreationSuperValidated }: Props = $props();
</script>

<SideBox>
	{#snippet headerLeading()}
		<Typography size="heading-2">
			<Translation key="article_editor.tags.list_label" />
		</Typography>
		<ArticleTagCreator superValidated={tagCreationSuperValidated} />
	{/snippet}
	{#snippet content()}
		<div class="tags-list">
			{#each tags as { checkedSuperValidated, deletionSuperValidated, name_translation_key }}
				<div class="tag-wrapper">
					<ArticleTag
						{checkedSuperValidated}
						{deletionSuperValidated}
						translationKey={name_translation_key}
					/>
				</div>
			{/each}
		</div>
	{/snippet}
</SideBox>

<style>
	.tags-list {
		display: flex;
		align-items: flex-start;
		flex-wrap: wrap;
		gap: var(--size-s);
	}
	.tag-wrapper {
		padding-bottom: var(--size-s);
	}
</style>
