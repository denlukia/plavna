<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import Button from '$lib/design/components/Button/Button.svelte';
	import FormWrapper from '$lib/design/components/FormWrapper/FormWrapper.svelte';
	import Input from '$lib/design/components/Input/Input.svelte';
	import Label from '$lib/design/components/Label/Label.svelte';
	import Labeled from '$lib/design/components/Label/Labeled.svelte';
	import Popup from '$lib/design/components/Popup/Popup.svelte';
	import Spacer from '$lib/design/components/Spacer/Spacer.svelte';
	import Typography from '$lib/design/components/Typography/Typography.svelte';
	import Translation from '$lib/features/i18n/Translation.svelte';
	import type { ImageProviderUpdate } from '$lib/features/user/parsers';

	type Props = {
		superValidated: SuperValidated<ImageProviderUpdate>;
	};
	let { superValidated }: Props = $props();

	let { form, errors, enhance } = superForm(superValidated);
</script>

<div class="image-provider-warning">
	<Typography size="small">
		<Translation key="article_editor.images.provider_warning" />
	</Typography>

	<Spacer size="s" />
	<div class="popup-wrapper">
		<Popup triggerType="button" buttonProps={{ size: 'small', kind: 'secondary' }}>
			{#snippet label()}
				<Translation key="article_editor.images.fill_in_provider" />
			{/snippet}
			{#snippet content()}
				<FormWrapper>
					<Typography size="heading-2">
						<Translation key="article_editor.images.image_provider" />
					</Typography>
					<Typography size="small">
						<Translation key="article_editor.images.provider_explanation" />
					</Typography>
					<form use:enhance method="POST" action="?/update_image_provider">
						<Labeled as="label">
							<Label><Translation key="article_editor.images.imagekit.url_endpoint" /></Label>
							<Input
								type="text"
								name="imagekit_url_endpoint"
								bind:value={$form.imagekit_url_endpoint}
							/>
						</Labeled>
						<Labeled as="label">
							<Label><Translation key="article_editor.images.imagekit.public_key" /></Label>
							<Input
								type="text"
								name="imagekit_public_key"
								bind:value={$form.imagekit_public_key}
							/>
						</Labeled>
						<Labeled as="label">
							<Label><Translation key="article_editor.images.imagekit.private_key" /></Label>
							<Input
								type="text"
								name="imagekit_private_key"
								bind:value={$form.imagekit_private_key}
							/>
						</Labeled>

						<Spacer />
						<Button><Translation key="article_editor.images.update" /></Button>
					</form>

					<div class="global-text-align-center">
						<Typography size="small">
							<Translation key="layout.or" />
						</Typography>
					</div>

					<form use:enhance method="POST" action="?/delete_image_provider">
						<Button kind="destructive"><Translation key="article_editor.images.delete" /></Button>
					</form>
					<!-- {JSON.stringify($errors)} -->
				</FormWrapper>
			{/snippet}
		</Popup>
	</div>
</div>

<style>
	.image-provider-warning {
		display: flex;
		flex-direction: column;
		gap: var(--size-4);
		align-items: center;
		justify-content: center;
		height: 100%;
		text-align: center;
	}
	.popup-wrapper {
		text-align: initial;
	}
</style>
