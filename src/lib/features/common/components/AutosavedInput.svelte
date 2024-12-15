<script lang="ts">
	import type { SupportedLang } from '@denlukia/plavna-common/types';
	import { onMount } from 'svelte';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { WAIT_BEFORE_AUTOSAVE_MS } from '$lib/collections/config';
	import Button from '$lib/design/components/Button/Button.svelte';
	import Translation from '$lib/features/i18n/Translation.svelte';

	import Input from '../../../design/components/Input/Input.svelte';
	import type { InputOrTextareaProps } from '../../../design/components/Input/types';
	import LanguagedInput from '../../i18n/Input/LanguagedInput.svelte';
	import { debounce } from '../utils';
	import Errors from './Errors.svelte';

	type Props = InputOrTextareaProps & {
		action: string;
		onSuccessfullUpdate?: (form: any) => void;
		superValidated: SuperValidated<any>;
		manualOnly?: boolean;
	};

	let {
		action,
		superValidated,
		onSuccessfullUpdate,
		manualOnly = true,
		...attributes
	}: Props = $props();

	let formRef: HTMLButtonElement | null = $state(null);
	let showSaveButton = $state(true);
	let elementRef: HTMLInputElement | null = $state(null);

	let { form, enhance, errors, submit } = superForm(superValidated, {
		resetForm: false,
		invalidateAll: false,
		onUpdate: (e) => {
			if (e.result.type === 'success') {
				const form = e.result.data.form;

				onSuccessfullUpdate?.(form);
			}
		},
		onUpdated: (e) => {
			if (manualOnly) return;

			setTimeout(() => elementRef?.focus());
		}
	});

	let firstInputName = $derived(Object.keys($form)[0]);

	function oninput(e: Event, lang?: SupportedLang) {
		if (manualOnly) return;

		const target = e.target as HTMLInputElement;
		if (lang && lang in $form) {
			form.update((v) => ({ ...v, [lang]: target.value }));
		} else {
			form.update((v) => ({ ...v, [firstInputName]: target.value }));
		}
		submit(elementRef);
	}

	const debouncedOninput = debounce(oninput, WAIT_BEFORE_AUTOSAVE_MS);

	$effect(() => {
		if (manualOnly) {
			showSaveButton = true;
		} else {
			showSaveButton = false;
		}
	});
</script>

{#snippet trailing()}
	<span class="save-button-wrapper" class:global-visually-hidden={!showSaveButton}>
		<span class="inner">
			<Button placement="in-input" bind:ref={formRef}>
				<Translation key="layout.save" />
			</Button>
		</span>
	</span>
{/snippet}

<form {action} use:enhance method="POST">
	{#if 'key' in $form}
		<LanguagedInput
			bind:elementRef
			superform={form}
			{...attributes}
			{trailing}
			oninput={debouncedOninput}
		/>
	{:else}
		<Input
			bind:elementRef
			bind:value={$form[firstInputName]}
			name={firstInputName}
			oninput={debouncedOninput}
			{...attributes}
			{trailing}
		></Input>
	{/if}
</form>
<Errors errors={$errors} />

<style>
	/* .save-button-wrapper {
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
	} */
</style>
