<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { superForm } from 'sveltekit-superforms/client';

	import { defaultLang, isSupportedLang, supportedLanguages } from '$lib/isomorphic/languages';
	import { generatePath } from '$lib/isomorphic/url';

	import type { TranslationUpdateZod } from '$lib/server/schemas/types';
	import type { SuperValidated } from 'sveltekit-superforms';

	export let superFormObj: SuperValidated<TranslationUpdateZod>;

	const { form, errors, enhance } = superForm(superFormObj);

	let currentLang = isSupportedLang($page.params.lang) ? $page.params.lang : defaultLang;
</script>

<fieldset>
	Редагування перекладу
	<form use:enhance action="?/update_translation" method="POST">
		<input name="_id" type="hidden" bind:value={$form._id} />
		<input name={currentLang} type="text" bind:value={$form[currentLang]} />
		<button type="submit">Save</button>
	</form>

	{#each supportedLanguages as lang}
		<svelte:element
			this={browser ? 'button' : 'a'}
			style={currentLang === lang ? 'font-weight: bold;' : 'font-weight: normal;'}
			role={browser ? 'button' : 'link'}
			on:click={() => (currentLang = lang)}
			href={browser ? undefined : generatePath($page.route.id || '', { '[lang]': lang })}
		>
			{lang}
		</svelte:element>
	{/each}
</fieldset>
