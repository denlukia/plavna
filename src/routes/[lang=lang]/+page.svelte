<script lang="ts">
	import { enhance } from '$app/forms';

	import Translation from '$lib/components/Translation.svelte';

	// export let data;
</script>

<h1><Translation key="landing" /></h1>
<form use:enhance method="POST">
	<button type="submit"><Translation key="to_sign_out" /></button>
</form>
