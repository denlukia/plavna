<script lang="ts">
	import Label from '$lib/design/components/Label/Label.svelte';
	import Labeled from '$lib/design/components/Label/Labeled.svelte';
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

<Labeled as="div" customClass="article-tags-list">
	<Label><Translation key="article_editor.tags.list_label" /></Label>
	<div class="tags-list">
		<ArticleTagCreator superValidated={tagCreationSuperValidated} />
		{#each tags as { checkedSuperValidated, deletionSuperValidated, name_translation_key }}
			<ArticleTag
				{checkedSuperValidated}
				{deletionSuperValidated}
				translationKey={name_translation_key}
			/>
		{/each}
	</div>
</Labeled>

<style>
	:global(.article-tags-list) {
		min-height: 100%;
	}
	.tags-list {
		display: flex;
		align-items: flex-start;
		flex-wrap: wrap;
		gap: var(--size-s);
		height: 100%;
	}
</style>
