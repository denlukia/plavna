<script lang="ts">
	import { page } from '$app/stores';

	import Image from '../../image/Image.svelte';

	type Props = {
		href: string;
	};

	let { href }: Props = $props();

	let image = $derived($page.data.images?.find((el) => el.id === Number(href)));
</script>

{#if image}
	<Image {image} />
{/if}
