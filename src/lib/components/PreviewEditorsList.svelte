<script lang="ts">
	import T from './Translation.svelte';

	import type {
		PostPreviewValuesUpdateZod,
		PostSelectWithoutPreviewValues,
		PreviewTypeSelect
	} from '$lib/server/domain/types';
	import type { SuperValidated } from 'sveltekit-superforms';

	export let previews: PreviewTypeSelect[];
	export let post: PostSelectWithoutPreviewValues;
	export let previewComponent: ConstructorOfATypedSvelteComponent;
	export let postPreviewForm: SuperValidated<PostPreviewValuesUpdateZod>;
</script>

Всі первью:
{#each previews as preview}
	<div>
		<T key={preview.name_translation_id} />
	</div>
{/each}

Поточне превью:
<svelte:component this={previewComponent} {post} {postPreviewForm} />
