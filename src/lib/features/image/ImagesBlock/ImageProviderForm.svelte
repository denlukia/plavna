<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import Button from '$lib/design/components/Button/Button.svelte';
	import FormWrapper from '$lib/design/components/FormWrapper/FormWrapper.svelte';
	import Input from '$lib/design/components/Input/Input.svelte';
	import Label from '$lib/design/components/Label/Label.svelte';
	import LabeledInput from '$lib/design/components/Label/LabeledInput.svelte';
	import Popup from '$lib/design/components/Popup/Popup.svelte';
	import Spacer from '$lib/design/components/Spacer/Spacer.svelte';
	import Typography from '$lib/design/components/Typography/Typography.svelte';
	import Translation from '$lib/features/i18n/Translation.svelte';
	import type { ImageProviderUpdate } from '$lib/features/user/parsers';

	type Props = {
		providerForm: SuperValidated<ImageProviderUpdate>;
	};
	let { providerForm }: Props = $props();

	let { form, errors, enhance } = superForm(providerForm);
</script>

<Typography size="heading-2">
	<Translation key="article_editor.images.image_provider" />
</Typography>
<Typography size="small">
	<Translation key="article_editor.images.provider_explanation" />
</Typography>
<Spacer />
<Popup triggerType="button">
	{#snippet label()}
		<Translation key="article_editor.images.fill_in_provider" />
	{/snippet}
	{#snippet content()}
		<FormWrapper>
			<form use:enhance method="POST" action="?/update_image_provider">
				<LabeledInput>
					<Label><Translation key="" /></Label>
					<Input
						type="text"
						name="imagekit_public_key"
						bind:value={$form.imagekit_public_key}
						placeholder="imagekit_public_key"
					/>
				</LabeledInput>
				<LabeledInput>
					<Label><Translation key="" /></Label>
					<Input
						type="text"
						name="imagekit_private_key"
						bind:value={$form.imagekit_private_key}
						placeholder="imagekit_private_key"
					/>
				</LabeledInput>
				<LabeledInput>
					<Label><Translation key="" /></Label>
					<Input
						type="text"
						name="imagekit_url_endpoint"
						bind:value={$form.imagekit_url_endpoint}
						placeholder="imagekit_url_endpoint"
					/>
				</LabeledInput>
				<Spacer />
				<Button>Update</Button>
			</form>

			<div class="global-text-align-center">
				<Typography size="small">
					<Translation key="layout.or" />
				</Typography>
			</div>

			<form use:enhance method="POST" action="?/delete_image_provider">
				<Button kind="destructive">Delete</Button>
			</form>
			<!-- {JSON.stringify($errors)} -->
		</FormWrapper>
	{/snippet}
</Popup>
