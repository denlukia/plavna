<script lang="ts">
	import T from './Translation.svelte';

	import type { PostPreviewUpdateZod, PreviewTypeSelect } from '$lib/server/domain/types';
	import type { SuperValidated } from 'sveltekit-superforms';

	export let previews: PreviewTypeSelect[];
	export let previewComponent: ConstructorOfATypedSvelteComponent;
	export let postPreviewForm: SuperValidated<PostPreviewUpdateZod>;
</script>

Всі первью:
{#each previews as preview}
	<div>
		<T key={preview.name_translation_id} />
	</div>
{/each}

Поточне превью:
<svelte:component this={previewComponent} {postPreviewForm} />
