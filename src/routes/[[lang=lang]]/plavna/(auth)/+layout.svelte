<script lang="ts">
	import Translation from '$lib/components/Translation.svelte';
</script>

<div>
	<h1>
		<a href="/plavna/login"><Translation key="login" /></a>
		<a href="/plavna/signup"><Translation key="signup" /></a>
	</h1>
	<slot />
</div>
