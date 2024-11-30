<script lang="ts">
	type Props = {
		css: string;
	};

	let { css }: Props = $props();
</script>

<svelte:head>
	{@html `<style>${css}</style>`}
</svelte:head>
