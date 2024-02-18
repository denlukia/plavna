<script lang="ts">
	import { enhance } from '$app/forms';

	import T from '$lib/components/Translation.svelte';
	import Input from '$lib/design-system/components/Input/Input.svelte';
	import Labeled from '$lib/design-system/components/Labeled.svelte';
	import Text from '$lib/design-system/components/Text.svelte';
	import Box from '$lib/design-system/components/Box/Box.svelte';
	import Button from '$lib/design-system/components/Button.svelte';
	import Spacer from '$lib/design-system/components/Spacer.svelte';
</script>

<!-- TODO Why ()=>{} ? -->
<form method="POST" use:enhance={() => {}}>
	<Box>
		<Labeled>
			<Text size="small-short"><T key="username" /></Text>
			<Input id="username" name="username" />
		</Labeled>
		<Spacer />
		<Labeled>
			<Text size="small-short"><T key="password" /></Text>
			<Input id="password" name="password" />
		</Labeled>
		<Spacer size="l" />
		<Button><T key="to_login" /></Button>
	</Box>
</form>

<style>
</style>
