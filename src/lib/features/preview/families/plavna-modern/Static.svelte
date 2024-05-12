<script lang="ts">
	import PreviewFoundation from '$lib/design-system/components/PreviewFoundation.svelte';
	import Typography from '$lib/design-system/components/Typography/Typography.svelte';
</script>

<PreviewFoundation>
	{#snippet main()}
		<span class="preview">
			<Typography>Plavna Modern</Typography>
		</span>
	{/snippet}
</PreviewFoundation>

<style>
	.preview {
		display: block;
		height: 100%;
		background-color: skyblue;
	}
</style>
