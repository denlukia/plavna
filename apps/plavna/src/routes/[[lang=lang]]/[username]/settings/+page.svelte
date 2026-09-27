<script lang="ts">
	import {
		AnimatedPage,
		Button,
		Column,
		FormWrapper,
		Input,
		Label,
		Labeled,
		Link,
		PasswordInput,
		Popup,
		Spacer,
		Typography
	} from '@plavna/design/components';
	import { enhance } from '$app/forms';
	import { superForm } from 'sveltekit-superforms';
	import ColumnedCards from '$lib/common/components/ColumnedCards.svelte';
	import { PAGE_INRO_DELAY_MS } from '$lib/common/config.js';
	import Errors from '$lib/errors/Errors.svelte';
	import Translation from '$lib/i18n/Translation.svelte';
	import Greetings from '$lib/user/greetings/Greetings.svelte';

	let { data } = $props();

	let {
		routeId,
		superValidated,
		githubSuperValidated,
		imageProviderSuperValidated,
		closedGreetings,
		lang
	} = $derived(data);

	let { form, enhance: enhanceSettings, errors } = superForm(superValidated);
	let {
		form: githubForm,
		errors: githubErrors,
		enhance: enhanceGithub
	} = superForm(githubSuperValidated, { resetForm: false });
	let {
		form: imageProviderForm,
		errors: imageProviderErrors,
		enhance: enhanceImageProvider
	} = superForm(imageProviderSuperValidated, { resetForm: false });

	let instructionOpen = $state(false);
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
		<Column>
			<form use:enhanceGithub method="POST" action="?/update_github">
				<Labeled as="label">
					<Label>
						<Translation key="settings.github.token_label" />
					</Label>
					<PasswordInput name="github_token" bind:value={$githubForm.github_token} />
					<Errors errors={$githubErrors.github_token} />
				</Labeled>

				<Spacer size="l" type="vertical" />
				<div class="github-actions">
					<Button>
						<Translation key="settings.save" />
					</Button>
					<Popup
						triggerType="button"
						bind:active={instructionOpen}
						buttonProps={{ kind: 'secondary', type: 'button' }}
						style="width: 340px"
					>
						{#snippet label()}
							<Translation key="settings.github.instruction_button" />
						{/snippet}
						{#snippet content()}
							<FormWrapper>
								<Typography size="heading-2">
									<Translation key="settings.github.instruction_title" />
								</Typography>
								<Typography size="body">
									<Translation key="settings.github.purpose" />
								</Typography>
								<Typography size="body">
									<Translation key="settings.github.step_1a" />{' '}
									<Link href="https://github.com/settings/personal-access-tokens/new">
										<Translation key="settings.github.new_token_link" />
									</Link>{' '}
									<Translation key="settings.github.step_1b" />
								</Typography>
								<Typography size="body">
									<Translation key="settings.github.step_2" />
								</Typography>
								<Typography size="body">
									<Translation key="settings.github.step_3" />
								</Typography>
							</FormWrapper>
						{/snippet}
					</Popup>
				</div>
			</form>
		</Column>
		<Column>
			<FormWrapper>
				<form use:enhanceImageProvider method="POST" action="?/update_image_provider">
					<Labeled as="label">
						<Label>
							<Translation key="settings.imagekit.url_endpoint" />
						</Label>
						<Input
							type="text"
							name="imagekit_url_endpoint"
							bind:value={$imageProviderForm.imagekit_url_endpoint}
						/>
						<Errors errors={$imageProviderErrors.imagekit_url_endpoint} />
					</Labeled>
					<Labeled as="label">
						<Label>
							<Translation key="settings.imagekit.public_key" />
						</Label>
						<Input
							type="text"
							name="imagekit_public_key"
							bind:value={$imageProviderForm.imagekit_public_key}
						/>
						<Errors errors={$imageProviderErrors.imagekit_public_key} />
					</Labeled>
					<Labeled as="label">
						<Label>
							<Translation key="settings.imagekit.private_key" />
						</Label>
						<PasswordInput
							name="imagekit_private_key"
							bind:value={$imageProviderForm.imagekit_private_key}
						/>
						<Errors errors={$imageProviderErrors.imagekit_private_key} />
					</Labeled>
					<Errors errors={$imageProviderErrors._errors} />

					<Spacer size="l" type="vertical" />
					<div class="imagekit-actions">
						<Button>
							<Translation key="settings.save" />
						</Button>
						<Button kind="secondary" formaction="?/delete_image_provider">
							<Translation key="settings.imagekit.delete" />
						</Button>
					</div>
				</form>
			</FormWrapper>
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
	.github-actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--size-m);
		--size-box-form-padding-top: var(--size-l);
		--size-box-padding-bottom: var(--size-l);
		--size-box-padding-inline: var(--size-xl);
		--text-body-line-height: 20px;
	}

	.imagekit-actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--size-m);
	}

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
