<script>
	import './styles.css';

	export let data;

	$: ({ width, height, preview_prop_1, preview_prop_2 } = data.params);
</script>

<div
	class="preview-root"
	style="--width: {width ? `${width}px` : '100%'}; 
				 --height: {height ? `${height}px` : '100%'}; 
				 --bg: {preview_prop_2 || 'greenyellow'};"
>
	<div class="preview">{preview_prop_1 || 'Test'}</div>
</div>

<style>
	.preview-root {
		/* TODO to single source of truth with main service */
		--artistic-padding: 16px;
		padding: var(--artistic-padding);
		width: var(--width);
		height: var(--height);
		outline: 1px solid black;
	}
	.preview {
		background-color: var(--bg);

		width: 100%;
		height: 100%;

		display: flex;
		justify-content: center;
		align-items: center;

		outline: 1px solid black;
	}
</style>
