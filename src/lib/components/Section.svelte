<script lang="ts">
	import SectionEditor from './editors/SectionEditor.svelte';

	import type { PostSelect, SectionSelect, TagPostSelect } from '$lib/server/domain/types';

	export let sectionData: {
		section: SectionSelect;
		posts: PostSelect[];
		tagsPosts: TagPostSelect[];
	};
</script>

<SectionEditor section={sectionData.section} />
{#each sectionData.posts as post}
	<div class="post">
		Id: {post.id}
	</div>
{/each}

<style>
	.post {
		display: block;
		background-color: #eee;
		width: 200px;
		padding: 20px;
		margin: 10px;
		border-radius: 10px;
	}
</style>
