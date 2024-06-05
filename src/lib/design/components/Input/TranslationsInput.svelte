<script lang="ts">
	import type { SupportedLang } from '@denlukia/plavna-common/types';
	import { page } from '$app/stores';

	import Input from './Input.svelte';
	import LangSelector from './LangSelector.svelte';
	import type { TranslationsInputProps } from './types';

	let {
		form,
		prefix,
		name,
		currentLang = $bindable($page.params.lang as SupportedLang),
		...other
	}: TranslationsInputProps = $props();

	let value = $state($form[currentLang]);
	let animateOnValueChange = $state(false);

	$effect(() => {
		animateOnValueChange = true;
		value = $form[currentLang];
		animateOnValueChange = false;
	});
</script>

<Input {...other} bind:value name={prefix ? prefix + name : name} {animateOnValueChange}>
	{#snippet trailing()}
		<LangSelector bind:value={currentLang} />
	{/snippet}
</Input>
