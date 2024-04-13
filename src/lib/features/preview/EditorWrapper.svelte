<script lang="ts">
	import type { SuperForm } from 'sveltekit-superforms';

	import type { ArticlePreviewUpdate } from '../article/parsers';
	import type { PreviewTemplateSelect } from './parsers';

	export let superForm: SuperForm<ArticlePreviewUpdate>;
	export let previewTypeId: PreviewTemplateSelect['id'];

	$: ({ enhance } = superForm);
</script>

<form use:enhance method="POST" action="?/update_preview">
	<input type="hidden" name="preview_type_id" bind:value={previewTypeId} />
	<slot />
</form>
