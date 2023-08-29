<script lang="ts">
	import { page } from '$app/stores';
	import PostPreview from './PostPreview.svelte';
	import SectionEditor from './editors/SectionEditor.svelte';

	import type {
		PostSelect,
		SectionSelect,
		TagPostSelect,
		TagSelect
	} from '$lib/server/domain/types';
	import SectionViewer from './SectionViewer.svelte';

	export let section: {
		meta: SectionSelect;
		posts: PostSelect[];
		tagsPosts: TagPostSelect[];
	};

	function getTagsForPost(
		post: PostSelect,
		tagsPosts: TagPostSelect[],
		tags: Record<string, TagSelect> | undefined
	) {
		const selectedTags = tagsPosts.filter((el) => el.post_id === post.id);
		if (tags) {
			return selectedTags.map((tagPost) => tags[tagPost.tag_id]).filter(Boolean);
		} else {
			return [];
		}
	}
</script>

{#if $page.data.user && $page.data.user.username === $page.params.username}
	<SectionEditor section={section.meta} />
{:else}
	<SectionViewer section={section.meta} />
{/if}

{#each section.posts as post (post.id)}
	<PostPreview {post} tags={getTagsForPost(post, section.tagsPosts, $page.data.tags)} />
{/each}
