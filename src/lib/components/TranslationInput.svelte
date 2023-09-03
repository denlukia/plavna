<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';

	import { defaultLang, isSupportedLang, supportedLanguages } from '$lib/isomorphic/languages';
	import { generatePath } from '$lib/isomorphic/url';

	import type { TranslationInsertZod, TranslationUpdateZod } from '$lib/server/collections/types';
	import type { SuperForm } from 'sveltekit-superforms/client';

	export let superFormStores: SuperForm<TranslationUpdateZod> | SuperForm<TranslationInsertZod>;

	$: ({ form, errors, enhance } = superFormStores);
	$: currentLang = isSupportedLang($page.params.lang) ? $page.params.lang : defaultLang;
</script>

<input name="key" type="hidden" bind:value={$form.key} />
{#each supportedLanguages as lang}
	<input
		style={currentLang === lang ? 'display: block;' : 'display: none;'}
		name={lang}
		type="text"
		bind:value={$form[lang]}
	/>
{/each}
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
