<script lang="ts">
	import { enhance } from '$app/forms';
	import T from '$lib/components/T.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h1><T key="profile" /></h1>
<div>
	<p><T key="user_id" />: {data.user.userId}</p>
	<p><T key="username" />: {data.user.username}</p>
</div>
<form use:enhance method="post">
	<button type="submit"><T key="to_sign_out" /></button>
</form>
