<script lang="ts">
	import type { SupportedLang } from '@denlukia/plavna-common/types';
	import { superForm, type SuperForm, type SuperValidated } from 'sveltekit-superforms';
	import Button from '$lib/design/components/Button/Button.svelte';

	import Input from '../../../design/components/Input/Input.svelte';
	import type { InputOrTextareaProps } from '../../../design/components/Input/types';
	import TranslationsInput from '../../i18n/Input/TranslationsInput.svelte';
	import { debounce } from '../utils';

	let {
		action,
		superformData,
		...attributes
	}: InputOrTextareaProps & {
		action: string;
		superformData: SuperValidated<any>;
	} = $props();

	let saveButtonRef: HTMLButtonElement | null = $state(null);

	let { form, enhance, errors } = superForm(superformData);

	let firstInputName = $derived(Object.keys($form)[0]);

	function submit() {
		console.log('submit');
		saveButtonRef?.click();
	}

	function oninput(e: Event, lang?: SupportedLang) {
		const target = e.target as HTMLInputElement;
		if (lang && lang in form) {
			form.set({ [lang]: target.value });
		} else {
			form.set({ [firstInputName]: target.value });
		}
		submit();
	}

	const debouncedOninput = debounce(oninput, 1000);

	// TODO: Show "Saved" or "Error:..." label after submit

	// TODO: Hide "Save" button when JS activates, don't show it for the first 3 seconds
</script>

{#snippet trailing()}
	<Button isInInput bind:ref={saveButtonRef}>Save</Button>
{/snippet}

<form {action} use:enhance method="POST">
	{#if 'key' in $form}
		<TranslationsInput superform={form} {...attributes} {trailing} oninput={debouncedOninput}
		></TranslationsInput>
	{:else}
		<Input
			bind:value={$form[firstInputName]}
			name={firstInputName}
			oninput={debouncedOninput}
			{...attributes}
			{trailing}
		></Input>
	{/if}
</form>
