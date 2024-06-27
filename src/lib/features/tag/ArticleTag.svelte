<script lang="ts">
	import { page } from '$app/stores';
	import { superForm } from 'sveltekit-superforms';
	import type { SuperValidated } from 'sveltekit-superforms';
	import Button from '$lib/design/components/Button/Button.svelte';
	import Checkbox from '$lib/design/components/Checkbox/Checkbox.svelte';
	import Label from '$lib/design/components/Label/Label.svelte';
	import Popup from '$lib/design/components/Popup/Popup.svelte';
	import Spacer from '$lib/design/components/Spacer/Spacer.svelte';
	import Typography from '$lib/design/components/Typography/Typography.svelte';
	import AutosavedInput from '$lib/features/common/components/AutosavedInput.svelte';

	import type { TranslationSelect } from '../i18n/parsers';
	import Translation from '../i18n/Translation.svelte';
	import type { TagDelete, TagUpdate } from './parsers';

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

	// So we can push submit by pressing anywhere in the form
	// and thus switch tags as usual even without JS
	let submitButtonId = $derived(`switch-tag-${$form.id}-button`);
</script>

<div class="tag">
	<form use:enhance method="POST" action="?/switch_tag">
		<label class="checked-form" for={submitButtonId}>
			<input name="id" type="hidden" bind:value={$form.id} />
			<div class="global-labeled-input-wrapper checkbox">
				<div class="events-none">
					<Checkbox checkboxSize="small" name="checked" bind:checked={$form.checked} />
				</div>
				{#if translationSuperValidated}
					<Typography size="body-short">
						<Translation superValidated={translationSuperValidated} />
					</Typography>
				{/if}
			</div>
		</label>
		<button class="global-visually-hidden" id={submitButtonId}>
			{$form.checked ? 'Uncheck' : 'Check'}
		</button>
	</form>

	<div class="editing-forms">
		<Popup triggerType="button" buttonProps={{ placement: 'in-tag' }}>
			{#snippet label()}:{/snippet}
			{#snippet content()}
				<div class="global-form">
					<div class="global-text-align-center">
						<Typography size="heading-2">
							<Translation key="article_editor.tags.editing_form_title" />
						</Typography>
					</div>

					<div class="global-labeled-input-wrapper">
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
					</div>

					<div class="global-text-align-center">
						<Typography size="small">
							<Translation key="layout.or" />
						</Typography>
					</div>

					<form
						class="global-display-contents"
						use:deletionEnhance
						method="POST"
						action="?/delete_tag"
					>
						<input name="id" type="hidden" bind:value={$deletionForm.id} />
						<Button kind="destructive">
							<Translation key="article_editor.tags.delete" />
						</Button>
					</form>
				</div>
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
