<script lang="ts">
	import { getAstNode } from 'svelte-exmarkdown';

	import ImageById from '../../image/ImageById.svelte';

	type Props = {
		src: string;
	};

	let { src }: Props = $props();

	let imageId = $derived(Number(src));
</script>

{#if !isNaN(imageId)}
	<div class="markdown-image">
		<ImageById id={imageId} flexibleHeight />
	</div>
{/if}

<style>
	.markdown-image {
		margin-bottom: var(--size-l);
	}
</style>
