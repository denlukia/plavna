<script lang="ts">
	import { page } from '$app/stores';

	import Image from '../../image/Image.svelte';

	export let href = '';
	// export let text = '';

	$: image = $page.data.images?.find((el) => el.id === Number(href));
</script>

{#if image}
	<Image {image} />
{/if}
