<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { superForm } from 'sveltekit-superforms/client';

	import { defaultLang, isSupportedLang, supportedLanguages } from '$lib/isomorphic/languages';
	import { generatePath } from '$lib/isomorphic/url';

	import type { TranslationUpdateZod } from '$lib/server/domain/types';
	import type { SuperValidated } from 'sveltekit-superforms';

	export let key: string | number;

	$: superFormObj = $page.data.translations[key] as SuperValidated<TranslationUpdateZod>;
	$: ({ form, errors, enhance } = superForm(superFormObj));
	$: currentLang = isSupportedLang($page.params.lang) ? $page.params.lang : defaultLang;
</script>

<form use:enhance action="?/update_translation" method="POST">
	<input name="_id" type="hidden" bind:value={key} />
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
	<button type="submit">Save</button>
</form>
