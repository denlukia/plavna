<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import type { SuperValidated } from 'sveltekit-superforms';
	import Button from '$lib/design/components/Button/Button.svelte';
	import Label from '$lib/design/components/Label/Label.svelte';
	import Popup from '$lib/design/components/Popup/Popup.svelte';
	import Spacer from '$lib/design/components/Spacer/Spacer.svelte';
	import Typography from '$lib/design/components/Typography/Typography.svelte';

	import TranslationsInput from '../i18n/Input/TranslationsInput.svelte';
	import type { TranslationInsert } from '../i18n/parsers';
	import Translation from '../i18n/Translation.svelte';

	export let superFormObj: SuperValidated<TranslationInsert>;

	$: superFormStores = superForm(superFormObj);
	$: ({ form, enhance } = superFormStores);
</script>

<Popup triggerType="button" buttonProps={{ size: 'small' }}>
	{#snippet label()}
		<Translation key="article_editor.tags.create" />
	{/snippet}
	{#snippet content()}
		<form class="global-display-contents" use:enhance action="?/create_tag" method="POST">
			<div class="global-text-align-center">
				<Typography size="heading-2">
					<Translation key="article_editor.tags.new_tag" />
				</Typography>
			</div>
			<Spacer />
			<div class="global-labeled-input-wrapper">
				<Label><Translation key="article_editor.tags.name_label" /></Label>
				<TranslationsInput superform={form} />
			</div>
			<Spacer size="l" />
			<Button>
				<Translation key="article_editor.tags.create" />
			</Button>
		</form>
	{/snippet}
</Popup>
