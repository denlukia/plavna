<script lang="ts">
	import T from './Translation.svelte';

	import type { PostSelect, PreviewTypeSelect } from '$lib/server/domain/types';

	export let previews: PreviewTypeSelect[];
	export let post: PostSelect;
	export let previewComponent: ConstructorOfATypedSvelteComponent;
</script>

{#each previews as preview}
	<div>
		<T key={preview.name_translation_id} />
	</div>
{/each}
<svelte:component this={previewComponent} {post} />
