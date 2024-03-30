<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import LanguagedImagesInput from '$lib/components/inputs/image/LanguagedImagesInput.svelte';
	import type { ImageCollectionItem } from '$lib/server/collections/types';

	export let image: ImageCollectionItem;

	$: ({ form: superValidated, meta } = image);
	$: ({ errors, enhance, form } = superForm(superValidated));
</script>

<form method="post" action="?/update_image" use:enhance>
	<LanguagedImagesInput name="image" image={meta} {errors} clientUpload withLanguages />
	<input name="id" type="hidden" bind:value={$form.id} />
	<button>Update image</button>
</form>
<form method="post" action="?/delete_image" use:enhance>
	<input name="id" type="hidden" bind:value={$form.id} />
	<button>Delete image</button>
</form>
