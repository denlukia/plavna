<script lang="ts">
	import Translation from './Translation.svelte';

	import type { PostPreviewUpdateZod, PreviewTypeExtended } from '$lib/server/collections/types';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { page } from '$app/stores';
	import { PREVIEW_EDITOR_PARAM_NAME } from '$lib/isomorphic/constants';
	import EditorWrapper from './previews/EditorWrapper.svelte';
	import { superForm } from 'sveltekit-superforms/client';

	export let previews: PreviewTypeExtended[];
	export let postPreviewForm: SuperValidated<PostPreviewUpdateZod>;

	let superFormObj = superForm(postPreviewForm);

	$: previewIdFromParam = $page.url.searchParams.get(PREVIEW_EDITOR_PARAM_NAME);
	$: initialPreviewId = previewIdFromParam
		? Number(previewIdFromParam)
		: postPreviewForm.data.preview_type_id;

	let overridenPreviewId: null | PreviewTypeExtended['id'] = null;
	$: finalPreviewId = overridenPreviewId ?? initialPreviewId;

	function formPreviewsArray(
		previews: PreviewTypeExtended[],
		postPreviewForm: SuperValidated<PostPreviewUpdateZod>
	) {}

	function getPreviewSpecificLink(preview: PreviewTypeExtended, currentURL: URL) {
		let url = new URL(currentURL);
		url.searchParams.set(PREVIEW_EDITOR_PARAM_NAME, String(preview.id));
		return url.pathname + url.search;
	}
</script>

Всі первью:
{#each previews as preview}
	<a href={getPreviewSpecificLink(preview, $page.url)}>
		<Translation key={preview.name_translation_id} />
	</a>
{/each}

Поточне превью:
{#if finalPreviewId}
	<EditorWrapper superForm={superFormObj} previewTypeId={finalPreviewId}>
		<svelte:component
			this={getPreviewComponent(previews, finalPreviewId)}
			superForm={superFormObj}
		/>
	</EditorWrapper>
{/if}
