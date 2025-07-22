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
		<ol class="tips">
			{#each [1, 2, 3] as const as tip}
				<li class="tip">
					<Typography size="body">
						<Translation key="settings.tips.{tip}" />
					</Typography>
				</li>
			{/each}
		</ol>
		<form use:enhance method="POST" action="?/close_greetings" class="close-greetings-form">
			<Button kind="translucent"><Translation key="settings.setup_username" /></Button>
		</form>
	</Greetings>
{/if}

<style>
	.close-greetings-form {
		margin-top: var(--size-xl);
		animation: fade-in 500ms 4000ms backwards;
	}

	.tips {
		list-style: none;
		padding: 0;
		margin: 0;
		counter-reset: tip-counter;
		color: white;
		opacity: 0.8;
	}

	.tip {
		position: relative;
		padding-left: 3em;
		margin-bottom: 1em;
		font-size: 1rem;
		line-height: 1.5;
	}

	.tip:nth-of-type(1) {
		animation: fade-in 500ms 3250ms backwards;
	}

	.tip:nth-of-type(2) {
		animation: fade-in 500ms 3500ms backwards;
	}

	.tip:nth-of-type(3) {
		animation: fade-in 500ms 3750ms backwards;
	}

	.tip::before {
		counter-increment: tip-counter;
		content: counter(tip-counter);
		position: absolute;
		left: 0;
		top: 0;
		width: 2em;
		height: 2em;
		border-radius: 50%;
		background-color: rgba(255, 255, 255, 0.15);
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
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
