<script lang="ts">
	import type { PreviewTemplateImageFieldsZod } from '$lib/server/collections/types';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import ImageInput from './ImageInput.svelte';

	export let errors: SuperForm<PreviewTemplateImageFieldsZod>['errors'];
	export let name: 'image';
</script>

<ImageInput {name} error={$errors[name]} />
