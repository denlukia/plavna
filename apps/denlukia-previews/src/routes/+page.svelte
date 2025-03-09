<script>
	import { ARTISTIC_OVERFLOW } from '@plavna/common';

	import './styles.css';

	export let data;

	$: ({ width, height, prop_1, prop_2 } = data);
</script>

<div
	class="preview-root"
	style="--width: {width ? `${width}px` : '100%'}; 
				 --height: {height ? `${height}px` : '100%'}; 
				 --bg: {prop_2 || 'greenyellow'};
				 --padding: {ARTISTIC_OVERFLOW}px"
>
	<div class="preview">{prop_1 || 'Test'}</div>
</div>

<style>
	.preview-root {
		padding: var(--padding);
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
