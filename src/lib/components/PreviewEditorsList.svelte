<script lang="ts">
	import T from './Translation.svelte';

	import type { PostPreviewValuesUpdate, PreviewTypeSelect } from '$lib/server/schemas/types';

	export let previews: PreviewTypeSelect[];
	export let currentPreviewId: PreviewTypeSelect['id'] | null;
	export let currentPreviewValues: PostPreviewValuesUpdate;
	export let previewComponent: ConstructorOfATypedSvelteComponent;
</script>

{#each previews as preview}
	<div>
		<T key={preview.name_translation_id} />
	</div>
{/each}
<svelte:component this={previewComponent} {currentPreviewValues} />
