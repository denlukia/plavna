<script lang="ts">
	import type { SuperForm } from 'sveltekit-superforms/client';
	import type { PostPreviewUpdateZod, PreviewTypeExtended } from '$lib/server/domain/types';

	export let superForm: SuperForm<PostPreviewUpdateZod>;
	export let previewTypeId: PreviewTypeExtended['id'];

	$: ({ enhance } = superForm);
</script>

<form use:enhance method="POST" action="?/update_preview">
	<input type="hidden" name="preview_type_id" bind:value={previewTypeId} />
	<slot />
</form>
