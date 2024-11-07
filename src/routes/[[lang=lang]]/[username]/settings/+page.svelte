<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import BlockAnimator from '$lib/design/components/BlockAnimator/BlockAnimator.svelte';
	import Button from '$lib/design/components/Button/Button.svelte';
	import Column from '$lib/design/components/Grid/Column.svelte';
	import Input from '$lib/design/components/Input/Input.svelte';
	import Label from '$lib/design/components/Label/Label.svelte';
	import Labeled from '$lib/design/components/Label/Labeled.svelte';
	import Spacer from '$lib/design/components/Spacer/Spacer.svelte';
	import Typography from '$lib/design/components/Typography/Typography.svelte';
	import ColumnedContent from '$lib/features/common/components/ColumnedContent.svelte';
	import Translation from '$lib/features/i18n/Translation.svelte';

	let { data } = $props();

	let { routeId, superValidated } = $derived(data);

	let { form, enhance, errors } = superForm(superValidated);
</script>

<BlockAnimator {routeId}>
	<Typography size="heading-1">
		<Translation key="settings.heading" />
	</Typography>

	<ColumnedContent>
		<Column>
			<form use:enhance method="POST">
				<Labeled>
					<Label>
						<Translation key="settings.username" />
					</Label>
					<Input type="text" name="username" bind:value={$form.username} />
				</Labeled>

				<Spacer size="l" type="vertical" />
				<Button>
					<Translation key="settings.save" />
				</Button>
			</form>
		</Column>
	</ColumnedContent>
</BlockAnimator>

<style>
</style>
