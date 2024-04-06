<script lang="ts">
	import { enhance } from '$app/forms';
	import Translation from '$lib/components/Translation.svelte';
	import Button from '$lib/design-system/components/Button.svelte';
	import Typography from '$lib/design-system/components/Typography.svelte';

	export let data;
</script>

<Typography size="heading-1"><Translation key="main.landing" /></Typography>
{#if data.user}
	<form use:enhance method="POST">
		<Button><Translation key="main.to_sign_out" /></Button>
	</form>
{/if}
