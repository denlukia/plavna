<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';

	import { defaultLang, isSupportedLang } from '$lib/isomorphic/languages';
	import { generatePath } from '$lib/isomorphic/url';

	import type {
		PreviewTemplateCreationFormZod,
		PreviewTemplateEditingFormZod,
		TranslationInsertZod,
		TranslationUpdateZod
	} from '$lib/server/collections/types';
	import type { SuperForm } from 'sveltekit-superforms/client';
	import { supportedLangs } from '@denlukia/plavna-common/constants';
	import type { SupportedLang } from '@denlukia/plavna-common/types';

	export let superFormStores:
		| SuperForm<TranslationInsertZod>
		| SuperForm<TranslationUpdateZod>
		| SuperForm<PreviewTemplateCreationFormZod>
		| SuperForm<PreviewTemplateEditingFormZod>;

	export let prefix: string = '';

	$: ({ form, errors, enhance } = superFormStores);
	$: currentLang = $page.params.lang as SupportedLang;
</script>

<div class="translation-input">
	{#if 'key' in $form}
		<input name="{prefix}key" type="hidden" bind:value={$form.key} />
	{/if}
	{#each supportedLangs as lang}
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
	{#each supportedLangs as lang}
		<input
			style={currentLang === lang ? 'display: block;' : 'display: none;'}
			name={prefix + lang}
			placeholder={lang}
			type="text"
			bind:value={$form[lang]}
		/>
	{/each}
</div>

<style>
	.translation-input {
		display: flex;
	}
</style>
