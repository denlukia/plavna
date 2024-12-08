<script lang="ts">
	import { enhance } from '$app/forms';
	import { superForm } from 'sveltekit-superforms';
	import AnimatedPage from '$lib/design/components/AnimatedPage/AnimatedPage.svelte';
	import Button from '$lib/design/components/Button/Button.svelte';
	import Column from '$lib/design/components/Grid/Column.svelte';
	import Input from '$lib/design/components/Input/Input.svelte';
	import Label from '$lib/design/components/Label/Label.svelte';
	import Labeled from '$lib/design/components/Label/Labeled.svelte';
	import Spacer from '$lib/design/components/Spacer/Spacer.svelte';
	import Typography from '$lib/design/components/Typography/Typography.svelte';
	import ColumnedContent from '$lib/features/common/components/ColumnedContent.svelte';
	import Translation from '$lib/features/i18n/Translation.svelte';
	import Greetings from '$lib/features/user/greetings/Greetings.svelte';

	let { data } = $props();

	let { routeId, superValidated, closedGreetings, lang } = $derived(data);

	let { form, enhance: enhanceSettings, errors } = superForm(superValidated);
</script>

<AnimatedPage key={routeId + lang}>
	<Typography size="heading-1">
		<Translation key="settings.heading" />
	</Typography>

	<ColumnedContent>
		<Column>
			<form use:enhanceSettings method="POST" action="?/update_settings">
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
</AnimatedPage>

{#if !closedGreetings}
	<Greetings>
		<form use:enhance method="POST" action="?/close_greetings" class="close-greetings-form">
			<Button kind="translucent"><Translation key="settings.setup_username" /></Button>
		</form>
	</Greetings>
{/if}

<style>
	.close-greetings-form {
		animation: fade-in 500ms 4000ms backwards;
	}

	@keyframes fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
