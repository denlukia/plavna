<!-- routes/signup/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';

	import Translation from '$lib/components/Translation.svelte';
</script>

<form method="POST" use:enhance>
	<label for="username"><Translation key="username" /></label><br />
	<input id="username" name="username" /><br />
	<label for="password"><Translation key="password" /></label><br />
	<input type="password" id="password" name="password" /><br />
	<button type="submit"><Translation key="to_signup" /></button>
</form>
