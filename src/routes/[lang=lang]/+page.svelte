<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/design/components/Button.svelte';
	import Typography from '$lib/design/components/Typography/Typography.svelte';
	import Translation from '$lib/features/i18n/Translation.svelte';

	export let data;
</script>

<Typography size="heading-1"><Translation key="main.landing" /></Typography>
{#if data.user}
	<form use:enhance method="POST">
		<Button><Translation key="main.to_sign_out" /></Button>
	</form>
{/if}
