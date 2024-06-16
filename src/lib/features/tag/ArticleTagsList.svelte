<script lang="ts">
	import Label from '$lib/design/components/Label/Label.svelte';
	import type { ArticleService } from '$lib/features/article/service';
	import type { ExtractMethods } from '$lib/features/common/types';

	import Translation from '../i18n/Translation.svelte';
	import ArticleTag from './ArticleTag.svelte';
	import ArticleTagCreator from './ArticleTagCreator.svelte';

	type ArticleEditorData = Awaited<ReturnType<ExtractMethods<ArticleService>['loadEditor']>>;

	type Props = {
		tags: ArticleEditorData['tagInfos'];
		tagCreationForm: ArticleEditorData['tagCreationForm'];
	};

	let { tags, tagCreationForm }: Props = $props();
</script>

<div class="available-tags global-labeled-input-wrapper">
	<Label><Translation key="article_editor.tags.list_label" /></Label>
	<div class="tags-list">
		<ArticleTagCreator superFormObj={tagCreationForm} />
		{#each tags as { checkedForm, deletionForm, name_translation_key }}
			<ArticleTag {checkedForm} {deletionForm} translationKey={name_translation_key} />
		{/each}
	</div>
</div>

<style>
	.available-tags {
		padding-inline-start: var(--size-xl);
	}
	.tags-list {
		display: flex;
		align-items: flex-start;
		flex-wrap: wrap;
		gap: var(--size-s);
		margin-top: var(--size-s);
	}
</style>
