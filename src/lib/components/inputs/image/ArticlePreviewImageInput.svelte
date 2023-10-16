<script lang="ts">
	import { supportedLangs } from '$lib/isomorphic/languages';
	import type { ArticlePreviewImageAllFieldsZod } from '$lib/server/collections/types';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import ImageInput from './ImageInput.svelte';

	export let errors: SuperForm<ArticlePreviewImageAllFieldsZod>['errors'];
	export let name: 'preview_image_1' | 'preview_image_2';
</script>

<ImageInput {name} error={$errors[name]} />
{#each supportedLangs as lang}
	<ImageInput name={`${name}.${lang}`} error={$errors[`${name}.${lang}`]} />
{/each}
