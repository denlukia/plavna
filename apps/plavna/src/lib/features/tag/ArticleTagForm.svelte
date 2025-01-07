<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import type { SuperValidated } from 'sveltekit-superforms';
	import Button from '$lib/design/components/Button/Button.svelte';
	import FormWrapper from '$lib/design/components/FormWrapper/FormWrapper.svelte';
	import Label from '$lib/design/components/Label/Label.svelte';
	import Labeled from '$lib/design/components/Label/Labeled.svelte';
	import Popup from '$lib/design/components/Popup/Popup.svelte';
	import Typography from '$lib/design/components/Typography/Typography.svelte';

	import LanguagedInput from '../i18n/Input/LanguagedInput.svelte';
	import Translation from '../i18n/Translation.svelte';
	import type { TranslationInsert } from '../i18n/validators';

	type Props = {
		superValidated: SuperValidated<TranslationInsert>;
	};
	let { superValidated }: Props = $props();

	let { form, enhance } = superForm(superValidated, {
		onResult: (e) => {
			if (e.result.type === 'success') {
				active = false;
			}
		}
	});

	let active = $state(false);
</script>

<Popup triggerType="button" bind:active>
	{#snippet label()}
		<Translation key="article_editor.tags.new" />
	{/snippet}
	{#snippet content()}
		<FormWrapper>
			<form use:enhance action="?/create_tag" method="POST">
				<div class="global-text-align-center">
					<Typography size="heading-2">
						<Translation key="article_editor.tags.new_tag" />
					</Typography>
				</div>
				<Labeled as="label">
					<Label><Translation key="article_editor.tags.name_label" /></Label>
					<LanguagedInput superform={form} />
					<Label tone="additional"><Translation key="article_editor.tags.hidden_tag_tip" /></Label>
				</Labeled>
				<Button>
					<Translation key="article_editor.tags.create" />
				</Button>
			</form>
		</FormWrapper>
	{/snippet}
</Popup>
