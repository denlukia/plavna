<script lang="ts">
	import { supportedLangs } from '$lib/isomorphic/languages';
	import type { ImageSelect } from '$lib/server/collections/types';
	import type { Writable } from 'svelte/store';

	import ImageInput from './ImageInput.svelte';

	export let name: string;
	export let errors: Writable<Record<string, string | string[] | undefined>>;
	export let withLanguages = false;
	export let image: ImageSelect | null = null;
	export let clientUpload: boolean = false;
</script>

<div class="image-collection-input">
	<b>
		{name}, id: {image?.id || 'undefined'}
	</b>
	<ImageInput {name} {image} {clientUpload} errors={$errors[name]} />
	{#if withLanguages}
		{#each supportedLangs as lang}
			<ImageInput {name} {lang} {image} {clientUpload} errors={$errors[`${name}.${lang}`]} />
		{/each}
	{/if}
</div>

<style>
	.image-collection-input {
		background: lightpink;
	}
</style>
