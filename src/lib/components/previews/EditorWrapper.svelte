<script lang="ts">
	import type { SuperForm } from 'sveltekit-superforms/client';
	import type { ArticlePreviewUpdateZod, PreviewTypeExtended } from '$lib/server/collections/types';

	export let superForm: SuperForm<ArticlePreviewUpdateZod>;
	export let previewTypeId: PreviewTypeExtended['id'];

	$: ({ enhance } = superForm);
</script>

<form use:enhance method="POST" action="?/update_preview">
	<input type="hidden" name="preview_type_id" bind:value={previewTypeId} />
	<slot />
</form>
