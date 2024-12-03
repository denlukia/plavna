<script lang="ts">
	import Button from '$lib/design/components/Button/Button.svelte';
	import Translation from '$lib/features/i18n/Translation.svelte';

	import type { TagsListForPage } from './types';

	type Props = {
		tags: TagsListForPage;
		tagsInText: number[];
		onTagClick: (tagId: number, action: 'add' | 'remove') => void;
	};

	let { tags, tagsInText, onTagClick }: Props = $props();
</script>

<div class="tags-list">
	{#each tags as tag}
		<Button
			size="small"
			type="button"
			kind={tagsInText.includes(tag.id) ? 'primary' : 'secondary'}
			onclick={() => onTagClick(tag.id, tagsInText.includes(tag.id) ? 'remove' : 'add')}
		>
			<Translation recordKey={tag.name_translation_key} />
			<span class="tag-id">
				ID:{tag.id}
			</span>
		</Button>
	{/each}
</div>

<style>
	.tags-list {
		display: flex;
		margin-top: var(--size-s-to-m);
		gap: var(--size-s);
	}
	.tag-id {
		margin-inline-start: var(--size-xs);
		opacity: 0.4;
	}
</style>
