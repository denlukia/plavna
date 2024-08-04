<script lang="ts">
	import type { ImageSelect } from '../parsers';
	import ImageInput from './ImageInput.svelte';

	type Props = {
		name: string;
		imageId: ImageSelect['id'];
		processing?: boolean;
		clientUpload?: boolean;
	};

	let { name, imageId, processing = $bindable(false), clientUpload = false }: Props = $props();
</script>

<div class="languaged-image-input">
	<ImageInput {name} {imageId} {clientUpload} {processing} />
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
