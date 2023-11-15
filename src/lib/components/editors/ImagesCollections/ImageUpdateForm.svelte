<script lang="ts">
	import LanguagedImagesInput from '$lib/components/inputs/image/LanguagedImagesInput.svelte';
	import type { ImageCollectionItem } from '$lib/server/collections/types';
	import { superForm } from 'sveltekit-superforms/client';

	export let image: ImageCollectionItem;

	$: ({ form, meta } = image);
	$: ({ errors } = superForm(form));
</script>

<form method="post" action="?/update_image">
	<LanguagedImagesInput name="image" image={meta} {errors} clientUpload />
	<button>Update image</button>
</form>
