<script lang="ts">
	import T from './Translation.svelte';

	import type { PostPreviewUpdateZod, PreviewTypeExtended } from '$lib/server/domain/types';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { page } from '$app/stores';
	import { PREVIEW_EDITOR_PARAM_NAME } from '$lib/isomorphic/constants';
	import EditorWrapper from './previews/EditorWrapper.svelte';
	import { superForm } from 'sveltekit-superforms/client';

	export let previews: PreviewTypeExtended[];
	export let postPreviewForm: SuperValidated<PostPreviewUpdateZod>;

	let overridenPreviewId: null | PreviewTypeExtended['id'] = null;
	let superFormObj = superForm(postPreviewForm);

	// TODO what forms are served for what state, switching with js
	$: previewIdFromParam = $page.url.searchParams.get(PREVIEW_EDITOR_PARAM_NAME);
	$: initialPreviewId = previewIdFromParam
		? Number(previewIdFromParam)
		: postPreviewForm.data.preview_type_id;
	$: finalPreviewId = overridenPreviewId ?? initialPreviewId;

	function getPreviewComponent(
		previews: PreviewTypeExtended[],
		previewId: PreviewTypeExtended['id']
	) {
		let previewRecord = previews.find((preview) => preview.id === previewId);
		return previewRecord?.component_editor;
	}

	function getPreviewSpecificLink(preview: PreviewTypeExtended, currentURL: URL) {
		let url = new URL(currentURL);
		url.searchParams.set(PREVIEW_EDITOR_PARAM_NAME, String(preview.id));
		return url.pathname + url.search;
	}
</script>

Всі первью:
{#each previews as preview}
	<a href={getPreviewSpecificLink(preview, $page.url)}>
		<T key={preview.name_translation_id} />
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
