<script lang="ts">
	import { enhance } from '$app/forms';

	import T from '$lib/components/Translation.svelte';
	import Input from '$lib/design-system/components/Input/Input.svelte';
	import Labeled from '$lib/design-system/components/Labeled.svelte';
	import Text from '$lib/design-system/components/Text.svelte';
	import Box from '$lib/design-system/components/Box/Box.svelte';
	import Button from '$lib/design-system/components/Button.svelte';
	import Spacer from '$lib/design-system/components/Spacer.svelte';
	import { spin } from '$lib/design-system/transitions/rotate';
</script>

<!-- TODO Why ()=>{} ? -->
<form
	class="box-wrapper"
	method="POST"
	use:enhance={() => {}}
	in:spin={{ duration: 300, delay: 150 }}
	out:spin={{ duration: 300 }}
>
	<Box>
		<Labeled>
			<Text size="small-short"><T key="username" /></Text>
			<Input id="username" name="username" />
		</Labeled>
		<Spacer />
		<Labeled>
			<Text size="small-short"><T key="password" /></Text>
			<Input id="password" name="password" type="password" />
		</Labeled>
		<Spacer size="l" />
		<Button><T key="to_login" /></Button>
	</Box>
</form>

<style>
	.box-wrapper {
		width: 300px;
	}
</style>
