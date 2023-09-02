<script lang="ts">
	import type { SuperForm } from 'sveltekit-superforms/client';
	import type { PostPreviewUpdateZod } from '$lib/server/collections/types';

	export let superForm: SuperForm<PostPreviewUpdateZod>;

	$: ({ form } = superForm);
</script>

<input name="preview_prop_1_value" type="text" bind:value={$form.preview_prop_1_value} />
<input name="preview_prop_2_value" type="text" bind:value={$form.preview_prop_2_value} />
<input name="preview_prop_3_value" type="text" bind:value={$form.preview_prop_3_value} />
<button>Update preview</button>
