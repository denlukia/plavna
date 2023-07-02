<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { superForm } from 'sveltekit-superforms/client';

	import { defaultLang, isSupportedLang, supportedLanguages } from '$lib/isomorphic/languages';
	import { generatePath } from '$lib/isomorphic/url';

	import type { TranslationInsertZod } from '$lib/server/schemas/types';
	import type { SuperValidated } from 'sveltekit-superforms';

	export let superFormObj: SuperValidated<TranslationInsertZod>;

	const { form, errors, enhance } = superForm(superFormObj);

	let currentLang = isSupportedLang($page.params.lang) ? $page.params.lang : defaultLang;
</script>

<fieldset>
	Створення тегу
	<form use:enhance action="?/create_tag" method="POST">
		{#each supportedLanguages as lang}
			<input
				name={lang}
				style={currentLang === lang ? 'display: block;' : 'display: none;'}
				type="text"
				bind:value={$form[lang]}
			/>
		{/each}

		{#each supportedLanguages as lang}
			<svelte:element
				this={browser ? 'button' : 'a'}
				type={browser ? 'button' : null}
				style={currentLang === lang ? 'font-weight: bold;' : 'font-weight: normal;'}
				role={browser ? 'button' : 'link'}
				on:click={() => (currentLang = lang)}
				href={browser ? undefined : generatePath($page.route.id || '', { '[lang]': lang })}
			>
				{lang}
			</svelte:element>
		{/each}
		<button type="submit">Save</button>
	</form>
</fieldset>
