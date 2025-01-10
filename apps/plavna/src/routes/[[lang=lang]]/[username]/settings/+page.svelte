<script lang="ts">
	import {
		AnimatedPage,
		Button,
		Column,
		Input,
		Label,
		Labeled,
		Spacer,
		Typography
	} from '@plavna/design/components';
	import { enhance } from '$app/forms';
	import { superForm } from 'sveltekit-superforms';
	import ColumnedCards from '$lib/common/components/ColumnedCards.svelte';
	import { PAGE_INRO_DELAY_MS } from '$lib/common/config.js';
	import Translation from '$lib/i18n/Translation.svelte';
	import Greetings from '$lib/user/greetings/Greetings.svelte';

	let { data } = $props();

	let { routeId, superValidated, closedGreetings, lang } = $derived(data);

	let { form, enhance: enhanceSettings, errors } = superForm(superValidated);
</script>

<AnimatedPage key={routeId + lang} introDelay={PAGE_INRO_DELAY_MS}>
	<Typography size="heading-1">
		<Translation key="settings.heading" />
	</Typography>

	<ColumnedCards>
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
	</ColumnedCards>
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
