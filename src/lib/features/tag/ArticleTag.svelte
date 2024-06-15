<script lang="ts">
	import { page } from '$app/stores';
	import { superForm } from 'sveltekit-superforms';
	import type { SuperValidated } from 'sveltekit-superforms';
	import Button from '$lib/design/components/Button/Button.svelte';
	import Checkbox from '$lib/design/components/Checkbox/Checkbox.svelte';
	import Popup from '$lib/design/components/Popup/Popup.svelte';
	import Typography from '$lib/design/components/Typography/Typography.svelte';
	import AutosavedInput from '$lib/features/common/components/AutosavedInput.svelte';

	import type { TranslationSelect } from '../i18n/parsers';
	import Translation from '../i18n/Translation.svelte';
	import type { TagDelete, TagUpdate } from './parsers';

	type Props = {
		checkedForm: SuperValidated<TagUpdate>;
		deletionForm: SuperValidated<TagDelete>;
		translationKey: TranslationSelect['key'];
	};

	let { checkedForm, translationKey }: Props = $props();

	let { enhance, errors, form } = superForm(checkedForm);

	let translationSuperValidated = $derived($page.data.translationForms[translationKey]);
</script>

<div class="tag">
	<form use:enhance method="POST" action="?/switch_tag">
		<label class="checked-form" for="update-tag">
			<input name="id" type="hidden" bind:value={$form.id} />
			<div class="events-none">
				<Checkbox name="checked" bind:checked={$form.checked} />
			</div>
			<Typography size="small">
				<Translation formObj={translationSuperValidated} />
			</Typography>
			<button class="global-visually-hidden" id="update-tag">
				{$form.checked ? 'Uncheck' : 'Check'}
			</button>
		</label>
	</form>

	<div class="editing-forms">
		<Popup triggerType="button" buttonProps={{ size: 'small' }}>
			{#snippet label()}:{/snippet}
			{#snippet content()}
				<Typography size="heading-2">
					<Translation key="article_editor.tags.form_title" />
				</Typography>
				<AutosavedInput superValidated={translationSuperValidated} action="?/update_translation" />
				<Typography size="small">
					<Translation key="article_editor.tags.or" />
				</Typography>
				<form use:enhance method="POST" action="?/delete_tag">
					<input name="id" type="hidden" bind:value={$form.id} />
					<Button kind="destructive">
						<Translation key="article_editor.tags.or" />
					</Button>
				</form>
			{/snippet}
		</Popup>
	</div>
</div>

<style>
	.tag {
		display: flex;
		align-items: center;
		background: var(--color-tag-bg);
		border-radius: var(--size-tag-border-radius);
	}
	.checked-form {
		display: flex;
		align-items: center;
		gap: var(--size-m);

		padding-inline: var(--size-tag-padding-inline);
		padding-block: var(--size-tag-padding-block);
	}
	.editing-forms {
		display: flex;
		align-items: center;
		padding-inline-end: var(--size-tag-padding-inline);
	}
	.events-none {
		pointer-events: none;
	}
</style>
