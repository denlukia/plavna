<script lang="ts">
	import T from '$lib/components/Translation.svelte';

	import type { LayoutData } from './$types';
</script>

<div>
	<h1>
		<a href="/plavna/login"><T key="login" /></a> <a href="/plavna/signup"><T key="signup" /></a>
	</h1>
	<slot />
</div>
