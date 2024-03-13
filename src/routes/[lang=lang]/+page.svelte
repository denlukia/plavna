<script lang="ts">
	import { enhance } from '$app/forms';

	import Translation from '$lib/components/Translation.svelte';
	import Button from '$lib/design-system/components/Button.svelte';
	import Text from '$lib/design-system/components/Text.svelte';

	// export let data;
</script>

<Text size="heading-1"><Translation key="landing" /></Text>
<form use:enhance method="POST">
	<Button><Translation key="to_sign_out" /></Button>
</form>
