<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	import type { PostPreviewUpdateZod } from '$lib/server/domain/types';
	import type { SuperValidated } from 'sveltekit-superforms';

	export let postPreviewForm: SuperValidated<PostPreviewUpdateZod>;

	const { form, errors, enhance } = superForm(postPreviewForm);
</script>

<form use:enhance method="POST" action="?/update_preview">
	<input name="preview_prop_1_value" type="text" bind:value={$form.preview_prop_1_value} />
	<input name="preview_prop_2_value" type="text" bind:value={$form.preview_prop_2_value} />
	<input name="preview_prop_3_value" type="text" bind:value={$form.preview_prop_3_value} />
	<button>Update preview</button>
</form>
