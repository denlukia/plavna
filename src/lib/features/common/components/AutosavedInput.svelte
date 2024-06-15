<script lang="ts">
	import type { SupportedLang } from '@denlukia/plavna-common/types';
	import { onMount } from 'svelte';
	import { superForm, type SuperForm, type SuperValidated } from 'sveltekit-superforms';
	import Button from '$lib/design/components/Button/Button.svelte';

	import Input from '../../../design/components/Input/Input.svelte';
	import type { InputOrTextareaProps } from '../../../design/components/Input/types';
	import TranslationsInput from '../../i18n/Input/TranslationsInput.svelte';
	import { debounce } from '../utils';

	let {
		action,
		superValidated,
		...attributes
	}: InputOrTextareaProps & {
		action: string;
		superValidated: SuperValidated<any>;
	} = $props();

	let saveButtonRef: HTMLButtonElement | null = $state(null);
	let showSaveButton = $state(true);

	let { form, enhance, errors } = superForm(superValidated, {
		resetForm: false,
		invalidateAll: false
	});

	let firstInputName = $derived(Object.keys($form)[0]);

	function oninput(e: Event, lang?: SupportedLang) {
		const target = e.target as HTMLInputElement;
		if (lang && lang in $form) {
			form.update((v) => ({ ...v, [lang]: target.value }));
		} else {
			form.update((v) => ({ ...v, [firstInputName]: target.value }));
		}

		saveButtonRef?.click();
	}

	const debouncedOninput = debounce(oninput, 1000);

	onMount(() => {
		showSaveButton = false;
	});
</script>

{#snippet trailing()}
	<span class="save-button-wrapper" class:global-visually-hidden={!showSaveButton}>
		<span class="inner">
			<Button isInInput bind:ref={saveButtonRef}>Save</Button>
		</span>
	</span>
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

<style>
	.save-button-wrapper {
		display: grid;
		grid-template-columns: 0fr;
		opacity: 0;
		margin-inline-start: calc(var(--size-input-buttons-gap) * -1);
		animation: 500ms 3s reveal forwards ease-out;
	}
	.inner {
		overflow: hidden;
		animation: 500ms 3s reveal-inner forwards ease-out;
	}

	@keyframes reveal {
		80% {
			opacity: 0;
			grid-template-columns: 1fr;
			margin-inline-start: 0;
		}
		100% {
			opacity: 1;
			grid-template-columns: 1fr;
			margin-inline-start: 0;
		}
	}

	@keyframes reveal-inner {
		80% {
			overflow: hidden;
		}
		100% {
			overflow: visible;
		}
	}
</style>
