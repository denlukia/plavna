<script lang="ts">
	import Label from '$lib/design/components/Label/Label.svelte';
	import Labeled from '$lib/design/components/Label/Labeled.svelte';
	import Typography from '$lib/design/components/Typography/Typography.svelte';
	import type { ArticleService } from '$lib/features/article/service';
	import type { ExtractMethods } from '$lib/features/common/types';

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

<div class="article-tags-list">
	<header class="header">
		<Typography size="heading-2">
			<Translation key="article_editor.tags.list_label" />
		</Typography>
		<div class="creator-margin">
			<ArticleTagCreator superValidated={tagCreationSuperValidated} />
		</div>
	</header>

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
</div>

<style>
	.article-tags-list {
		padding: var(--size-tags-list-padding);
		border-radius: var(--size-tags-list-border-radius);
		background: var(--color-tags-list-bg);
	}
	.creator-margin {
		margin-bottom: var(--size-xs);
	}
	.header {
		display: flex;
		gap: var(--size-m);
		padding-bottom: var(--size-m-to-l);
		align-items: flex-end;
	}
	.tags-list {
		display: flex;
		align-items: flex-start;
		flex-wrap: wrap;
		gap: var(--size-s);
	}
	.tag-wrapper {
		padding-bottom: var(--size-l);
	}
</style>
