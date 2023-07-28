<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	import type { PageCreateFormZod } from '$lib/server/domain/types';
	import type { SuperValidated } from 'sveltekit-superforms';

	export let formObj: SuperValidated<PageCreateFormZod>;

	const { form, errors, enhance } = superForm(formObj);
</script>

<form use:enhance method="POST">
	<input type="text" name="slug" bind:value={$form.slug} />
	<button formaction="?/create">Create</button>
</form>
