<script lang="ts">
	import { superForm } from 'sveltekit-superforms';

	import LanguagedImageInput from '../ImageInput/LanguagedImageInput.svelte';
	import type { ImageCollectionItem } from '../parsers';

	export let image: ImageCollectionItem;

	$: ({ form: superValidated, meta } = image);
	$: ({ errors, enhance, form } = superForm(superValidated));
</script>

<form method="post" action="?/update_image" use:enhance>
	<LanguagedImageInput name="image" imageId={meta.id} clientUpload />
	<input name="id" type="hidden" bind:value={$form.id} />
	<button>Update image</button>
</form>
<form method="post" action="?/delete_image" use:enhance>
	<input name="id" type="hidden" bind:value={$form.id} />
	<button>Delete image</button>
</form>
