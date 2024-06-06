<script lang="ts">
	import type { SupportedLang } from '@denlukia/plavna-common/types';
	import { page } from '$app/stores';
	import type { SuperForm } from 'sveltekit-superforms';
	import type { InputProps } from '$lib/design/components/Input/types';

	import Input from '../../../design/components/Input/Input.svelte';
	import type { TranslationInsert } from '../parsers';
	import LangSelector from './LangSelector.svelte';

	let {
		superform,
		prefix,
		name,
		currentLang = $bindable($page.params.lang as SupportedLang),
		trailing,
		...other
	}: InputProps & {
		superform: SuperForm<TranslationInsert>['form'];
		prefix?: string | null;
		currentLang?: SupportedLang;
	} = $props();

	let value = $state($superform[currentLang]);
	let animateOnValueChange = $state(false);

	$effect(() => {
		animateOnValueChange = true;
		value = $superform[currentLang];
		animateOnValueChange = false;
	});
</script>

{#snippet trailingWithLangSelector()}
	<LangSelector bind:value={currentLang} />
	{#if trailing}
		{@render trailing()}
	{/if}
{/snippet}

<Input
	bind:value
	name={prefix ? prefix + name : name}
	trailing={trailingWithLangSelector}
	{animateOnValueChange}
	{...other}
></Input>
