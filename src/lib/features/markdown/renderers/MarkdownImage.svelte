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
	<ImageById id={imageId} />
{/if}
