<script lang="ts">
	import { page } from '$app/stores';

	import ImageById from '../../image/ImageById.svelte';

	type Props = {
		href: string;
	};

	let { href }: Props = $props();

	let imageId = $derived(Number(href));
</script>

{#if !isNaN(imageId)}
	<ImageById id={imageId} />
{/if}
