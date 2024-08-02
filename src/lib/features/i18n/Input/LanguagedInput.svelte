<script lang="ts">
	import { supportedLangs } from '@denlukia/plavna-common/constants';
	import type { SupportedLang } from '@denlukia/plavna-common/types';
	import { page } from '$app/stores';
	import { untrack } from 'svelte';
	import type { SuperForm } from 'sveltekit-superforms';
	import type { InputOrTextareaProps } from '$lib/design/components/Input/types';

	import Input from '../../../design/components/Input/Input.svelte';
	import type { TranslationInsert } from '../parsers';
	import LangSelector from './LangSelector.svelte';

	let {
		superform,
		prefix,
		name,
		currentLang = $bindable($page.params.lang as SupportedLang),
		trailing,
		oninput: oninputProp,
		selectionStart = $bindable(0),
		selectionEnd = $bindable(0),
		placeholder,
		...attributes
	}: InputOrTextareaProps & {
		superform: SuperForm<TranslationInsert>['form'];
		prefix?: string | null;
		currentLang?: SupportedLang;
		oninput?: (event: Event, lang: SupportedLang) => void;
	} = $props();

	let value = $state($superform[currentLang]);
	let animateOnValueChange = $state(false);

	$effect(() => {
		currentLang;
		animateOnValueChange = true;
		value = untrack(() => $superform[currentLang]);
		animateOnValueChange = false;
	});

	$effect(() => {
		value = $superform[currentLang];
	});

	function oninput(event: Event) {
		const target = event.target as HTMLInputElement;
		$superform[currentLang] = target.value;
		oninputProp && oninputProp(event, currentLang);
	}

	function getName(name: string) {
		return prefix ? prefix + name : name;
	}
</script>

{#snippet trailingWithLangSelector()}
	<LangSelector bind:value={currentLang} />
	{#if trailing}
		{@render trailing()}
	{/if}
{/snippet}

<!-- Hidden langs and key -->
<input type="hidden" name="key" value={$superform.key} />
{#each supportedLangs as lang}
	{#if lang !== currentLang}
		<input type="hidden" name={getName(lang)} value={$superform[lang]} />
	{/if}
{/each}

<!-- Visible lang -->
<Input
	bind:value
	bind:selectionStart
	bind:selectionEnd
	{oninput}
	name={getName(currentLang)}
	trailing={trailingWithLangSelector}
	{animateOnValueChange}
	{placeholder}
	{...attributes}
></Input>
