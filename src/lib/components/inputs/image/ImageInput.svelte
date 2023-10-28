<script lang="ts">
	import Image from '$lib/components/Image.svelte';
	import { supportedLangs } from '$lib/isomorphic/languages';
	import type { ImageSelect } from '$lib/server/collections/types';

	export let name: string;
	export let errors: string[] | undefined;
	export let withLanguages = false;
	export let image: ImageSelect | null = null;
</script>

<div class="image-input">
	{#if image}
		<Image {image} />
	{/if}
	{name}
	<input type="file" {name} />
	{#if withLanguages}
		{#each supportedLangs as lang}
			{@const fullName = `${name}.${lang}`}
			{fullName}
			<input type="file" name={fullName} />
		{/each}
	{/if}
	{errors}
</div>

<style>
	.image-input {
		background: lightpink;
	}
</style>
