<script lang="ts">
	import type { Spring } from 'svelte/motion';

	export let progress: Spring<number> | null;
</script>

<div class="progress">
	{progress ? $progress : null}
</div>

<style>
	.progress {
		position: absolute;
		top: 0;
		left: 0;
	}
</style>
