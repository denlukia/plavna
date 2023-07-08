<script lang="ts">
	import { enhance } from '$app/forms';

	import T from '$lib/components/Translation.svelte';

	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h1><T key="landing" /></h1>
<form use:enhance method="post">
	<button type="submit"><T key="to_sign_out" /></button>
</form>
