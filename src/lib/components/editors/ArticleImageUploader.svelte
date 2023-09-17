<script lang="ts">
	import { IMAGEKIT_UPLOAD_ENDPOINT } from '$lib/isomorphic/constants';
	import type { ImageProviderUpdateZod } from '$lib/server/collections/types';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';

	export let providerForm: SuperValidated<ImageProviderUpdateZod>;

	$: ({ form, errors, enhance } = superForm(providerForm));
</script>

<fieldset>
	Image provider
	<form use:enhance method="POST" action="?/update_image_provider">
		<input
			type="text"
			name="imagekit_public_key"
			bind:value={$form.imagekit_public_key}
			placeholder="imagekit_public_key"
		/>
		<input
			type="text"
			name="imagekit_private_key"
			bind:value={$form.imagekit_private_key}
			placeholder="imagekit_private_key"
		/>
		<input
			type="text"
			name="imagekit_url_endpoint"
			bind:value={$form.imagekit_url_endpoint}
			placeholder="imagekit_url_endpoint"
		/>
		<button>Update</button>
	</form>
	<form use:enhance method="POST" action="?/delete_image_provider">
		<button>Delete</button>
	</form>
	{JSON.stringify($errors)}
</fieldset>
