<script lang="ts">
	import { supportedLangs } from '$lib/isomorphic/languages';
	import type { ImageSelect } from '$lib/server/collections/types';

	import ImageInput from './ImageInput.svelte';

	export let name: string;
	export let errors: string[] | undefined;
	export let withLanguages = false;
	export let image: ImageSelect | null = null;
</script>

<div class="image-collection-input">
	<b>
		{name}, id: {image?.id || 'undefined'}
	</b>
	<ImageInput {name} {image} />
	{#if withLanguages}
		{#each supportedLangs as lang}
			<ImageInput {name} {lang} {image} />
		{/each}
	{/if}
	Errors: {errors}
</div>

<style>
	.image-collection-input {
		background: lightpink;
	}
</style>
