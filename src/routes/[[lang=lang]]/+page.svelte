<script lang="ts">
	import { enhance } from '$app/forms';

	import T from '$lib/components/Translation.svelte';

	export let data;
</script>

<h1><T key="landing" /></h1>
<form use:enhance method="post">
	<button type="submit"><T key="to_sign_out" /></button>
</form>
