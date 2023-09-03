<script lang="ts">
	import type { SuperForm } from 'sveltekit-superforms/client';
	import type { ArticlePreviewUpdateZod } from '$lib/server/collections/types';

	export let superForm: SuperForm<ArticlePreviewUpdateZod>;

	$: ({ form } = superForm);
</script>

<input name="preview_prop_1_value" type="text" bind:value={$form.preview_prop_1_value} />
<input name="preview_prop_2_value" type="text" bind:value={$form.preview_prop_2_value} />
<input name="preview_prop_3_value" type="text" bind:value={$form.preview_prop_3_value} />
<button>Update preview</button>
