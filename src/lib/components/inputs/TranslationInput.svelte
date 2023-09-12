<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';

	import { defaultLang, isSupportedLang, supportedLanguages } from '$lib/isomorphic/languages';
	import { generatePath } from '$lib/isomorphic/url';

	import type {
		PreviewTemplateCreationFormZod,
		PreviewTemplateEditingFormZod,
		TranslationInsertZod,
		TranslationUpdateZod
	} from '$lib/server/collections/types';
	import type { SuperForm } from 'sveltekit-superforms/client';

	export let superFormStores:
		| SuperForm<TranslationInsertZod>
		| SuperForm<TranslationUpdateZod>
		| SuperForm<PreviewTemplateCreationFormZod>
		| SuperForm<PreviewTemplateEditingFormZod>;

	export let prefix: string = '';

	$: ({ form, errors, enhance } = superFormStores);
	$: currentLang = isSupportedLang($page.params.lang) ? $page.params.lang : defaultLang;
</script>

{#if 'key' in $form}
	<input name="{prefix}key" type="hidden" bind:value={$form.key} />
{/if}
{#each supportedLanguages as lang}
	<svelte:element
		this={browser ? 'button' : 'a'}
		style={currentLang === lang ? 'font-weight: bold;' : 'font-weight: normal;'}
		type={browser ? 'button' : null}
		role={browser ? 'button' : 'link'}
		on:click={() => (currentLang = lang)}
		href={browser ? undefined : generatePath($page.route.id || '', { '[lang]': lang })}
	>
		{lang}
	</svelte:element>
{/each}
{#each supportedLanguages as lang}
	<input
		style={currentLang === lang ? 'display: block;' : 'display: none;'}
		name={prefix + lang}
		placeholder={lang}
		type="text"
		bind:value={$form[lang]}
	/>
{/each}
