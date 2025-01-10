<script lang="ts">
	type Props = {
		links: string[];
	};

	let { links }: Props = $props();
</script>

<svelte:head>
	{#each links as l}
		{@const type = l.split('.').pop()}
		<link rel="preload" href={l} as="font" type="font/{type}" crossorigin="anonymous" />
	{/each}
</svelte:head>
