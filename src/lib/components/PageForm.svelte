<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	import type { PageUpdateFormZod } from '$lib/server/domain/types';
	import type { SuperValidated } from 'sveltekit-superforms';

	export let formObj: SuperValidated<PageUpdateFormZod>;

	const { form, errors, enhance } = superForm(formObj);
</script>

<form use:enhance method="POST">
	<input type="hidden" name="id" bind:value={$form.id} />
	<input type="text" name="slug" bind:value={$form.slug} />
	<button formaction="?/update">Update</button>
	<button formaction="?/delete">Delete</button>
</form>
