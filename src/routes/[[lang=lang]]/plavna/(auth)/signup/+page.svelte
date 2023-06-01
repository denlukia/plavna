<!-- routes/signup/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import T from '$lib/components/T.svelte';
</script>

<form method="POST" use:enhance>
	<label for="username"><T key="username" /></label><br />
	<input id="username" name="username" /><br />
	<label for="password"><T key="password" /></label><br />
	<input type="password" id="password" name="password" /><br />
	<button type="submit"><T key="to_signup" /></button>
</form>
