<script lang="ts">
	import Button from '@plavna/design/components/Button/Button.svelte';
	import Checkbox from '@plavna/design/components/Checkbox/Checkbox.svelte';
	import FormWrapper from '@plavna/design/components/FormWrapper/FormWrapper.svelte';
	import Label from '@plavna/design/components/Label/Label.svelte';
	import Labeled from '@plavna/design/components/Label/Labeled.svelte';
	import Popup from '@plavna/design/components/Popup/Popup.svelte';
	import Typography from '@plavna/design/components/Typography/Typography.svelte';
	import { page } from '$app/stores';
	import { superForm } from 'sveltekit-superforms';
	import type { SuperValidated } from 'sveltekit-superforms';
	import AutosavedInput from '$lib/features/common/components/AutosavedInput.svelte';

	import Translation from '../i18n/Translation.svelte';
	import type { TranslationSelect } from '../i18n/validators';
	import type { TagDelete, TagUpdate } from './validators';

	type Props = {
		checkedSuperValidated: SuperValidated<TagUpdate>;
		deletionSuperValidated: SuperValidated<TagDelete>;
		translationKey: TranslationSelect['key'];
	};

	let { checkedSuperValidated, deletionSuperValidated, translationKey }: Props = $props();

	let { enhance, errors, form } = superForm(checkedSuperValidated, {
		invalidateAll: false,
		resetForm: false,
		applyAction: true,
		onSubmit: () => {
			$form.checked = !$form.checked;
		}
	});
	let { form: deletionForm, enhance: deletionEnhance } = superForm(deletionSuperValidated);

	let translationSuperValidated = $state($page.data.translationForms?.[translationKey]);
</script>

<div class="tag">
	<form use:enhance method="POST" action="?/switch_tag">
		<button class="global-reset-button checked-form">
			<input name="id" type="hidden" bind:value={$form.id} />
			<Labeled kind="for-checkbox">
				<div class="checkbox-wrapper">
					<Checkbox checkboxSize="small" name="checked" bind:checked={$form.checked} />
				</div>
				<Typography size="body-short">
					<Translation superValidated={translationSuperValidated} />
				</Typography>
			</Labeled>
		</button>
	</form>

	<div class="editing-forms">
		<Popup triggerType="button" buttonProps={{ placement: 'in-tag' }}>
			{#snippet label()}:{/snippet}
			{#snippet content()}
				<FormWrapper>
					<div class="global-text-align-center">
						<Typography size="heading-2">
							<Translation key="article_editor.tags.template_editing_form_title" />
						</Typography>
					</div>

					<Labeled as="label">
						<Label><Translation key="article_editor.tags.edit_name_label" /></Label>
						{#if translationSuperValidated}
							<AutosavedInput
								superValidated={translationSuperValidated}
								action="?/update_translation"
								onSuccessfullUpdate={(data) => {
									translationSuperValidated = { ...translationSuperValidated, ...data };
								}}
							/>
						{/if}
						<Label tone="additional"><Translation key="article_editor.tags.hidden_tag_tip" /></Label
						>
					</Labeled>

					<div class="global-text-align-center">
						<Typography size="small">
							<Translation key="layout.or" />
						</Typography>
					</div>

					<form use:deletionEnhance method="POST" action="?/delete_tag">
						<input name="id" type="hidden" bind:value={$deletionForm.id} />
						<Button kind="destructive">
							<Translation key="article_editor.tags.delete" />
						</Button>
					</form>
				</FormWrapper>
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
		padding: var(--size-tag-padding);
	}
	.editing-forms {
		display: flex;
		align-items: center;
		padding-inline-end: var(--size-tag-padding-inline-end);
	}
	.checkbox-wrapper {
		margin-inline-end: var(--size-xs);
		pointer-events: none;
	}
</style>
