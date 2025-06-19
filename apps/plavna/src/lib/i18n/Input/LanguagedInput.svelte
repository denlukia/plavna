<script lang="ts">
	import { supportedLangs } from '@plavna/common';
	import type { SupportedLang } from '@plavna/common';
	import type { InputOrTextareaProps } from '@plavna/design/components';
	import { Input } from '@plavna/design/components';
	import { page } from '$app/stores';
	import { untrack } from 'svelte';
	import type { SuperForm } from 'sveltekit-superforms';

	import { getLang } from '../utils';
	import type { TranslationInsert } from '../validators';
	import LangSelector from './LangSelector.svelte';

	let {
		superform,
		prefix,
		name,
		trailing,
		currentLang = $bindable(getLang($page.params.lang)),
		oninput: oninputProp,
		selectionStart = $bindable(0),
		selectionEnd = $bindable(0),
		elementRef = $bindable(null),
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
	let skippedOnce = $state(false);

	$effect(() => {
		currentLang;
		animateOnValueChange = untrack(() => skippedOnce) ? true : false;
		skippedOnce = true;
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
	bind:elementRef
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
