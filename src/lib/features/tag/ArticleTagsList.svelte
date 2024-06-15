<script lang="ts">
	import type { ArticleService } from '$lib/features/article/service';
	import type { ExtractMethods } from '$lib/features/common/types';

	import ArticleTag from './ArticleTag.svelte';
	import ArticleTagCreator from './ArticleTagCreator.svelte';

	type ArticleEditorData = Awaited<ReturnType<ExtractMethods<ArticleService>['loadEditor']>>;

	type Props = {
		tags: ArticleEditorData['tagInfos'];
		tagCreationForm: ArticleEditorData['tagCreationForm'];
	};

	let { tags, tagCreationForm }: Props = $props();
</script>

<div class="tags-list">
	{#each tags as { checkedForm, deletionForm, name_translation_key }}
		<ArticleTag {checkedForm} {deletionForm} translationKey={name_translation_key} />
	{/each}
	<ArticleTagCreator superFormObj={tagCreationForm} />
</div>

<style>
	.tags-list {
		display: flex;
		flex-wrap: wrap;
		gap: var(--size-m);
	}
</style>
