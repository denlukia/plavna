<script lang="ts">
	import Button from '$lib/design/components/Button/Button.svelte';
	import Translation from '$lib/features/i18n/Translation.svelte';

	import type { TagsListForPage } from './types';

	type Props = {
		tags: TagsListForPage;
		tagsInText: number[];
		onTagClick: (tagId: number) => void;
	};

	let { tags, tagsInText, onTagClick }: Props = $props();
</script>

<div class="tags-list">
	{#each tags as tag}
		<Button
			size="small"
			type="button"
			kind={tagsInText.includes(tag.id) ? 'primary' : 'secondary'}
			onclick={() => onTagClick(tag.id)}
		>
			<Translation recordKey={tag.name_translation_key} />
			<span class="tag-id">
				ID:{tag.id}
			</span>
		</Button>
	{/each}
</div>
