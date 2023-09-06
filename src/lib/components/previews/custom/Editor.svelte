<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import type { ArticlePreviewUpdateZod } from '$lib/server/collections/types';
	import type { SuperValidated } from 'sveltekit-superforms';

	export let formObj: SuperValidated<ArticlePreviewUpdateZod>;

	$: ({ form } = superForm(formObj));
</script>

<h2>CUSTOM PREVIEW</h2>
<input name="preview_prop_1" type="text" bind:value={$form.preview_prop_1} />
<input name="preview_prop_2" type="text" bind:value={$form.preview_prop_2} />

<button>Update preview</button>
