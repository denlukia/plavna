<script lang="ts">
	import { supportedLangs } from '@denlukia/plavna-common/constants';

	import ImageInput from './ImageInput.svelte';
	import type { ImageSelect } from './parsers';

	export let name: string;
	export let withLanguages = false;
	export let image: ImageSelect | null = null;
	export let clientUpload: boolean = false;
</script>

<div class="languaged-image-input">
	<ImageInput {name} {image} {clientUpload} />
	<!-- {#if withLanguages}
		{#each supportedLangs as lang}
			<ImageInput {name} {lang} {image} {clientUpload} />
		{/each}
	{/if} -->
</div>

<style>
	.languaged-image-input {
		/* background: lightpink; */
	}
</style>
