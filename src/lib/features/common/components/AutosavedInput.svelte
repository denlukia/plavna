<script lang="ts">
	import type { SupportedLang } from '@denlukia/plavna-common/types';
	import type { SuperForm } from 'sveltekit-superforms';
	import ButtonInInput from '$lib/design/components/Input/ButtonInInput.svelte';

	import Input from '../../../design/components/Input/Input.svelte';
	import type { InputProps } from '../../../design/components/Input/types';
	import TranslationsInput from '../../i18n/Input/TranslationsInput.svelte';

	let {
		action,
		superform,
		enhance,
		value = $bindable(),
		...other
	}: InputProps & {
		action: string;
		superform: SuperForm<any>['form'];
		enhance: SuperForm<any>['enhance'];
		prefix?: string | null;
		currentLang?: SupportedLang;
	} = $props();

	let saveButtonElement: HTMLButtonElement | null = $state(null);

	superform.subscribe(() => {
		onValueChange();
	});

	$effect(() => {
		onValueChange();
	});

	function onValueChange() {}
</script>

<form {action} use:enhance method="POST">
	<svelte:component this={superform ? TranslationsInput : Input} {superform} {...other}>
		{#snippet trailing()}
			<ButtonInInput bind:element={saveButtonElement}>Save</ButtonInInput>
		{/snippet}
	</svelte:component>
</form>
