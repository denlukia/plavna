<script lang="ts">
	import { supportedLangs } from '@denlukia/plavna-common/constants';
	import type { SupportedLang } from '@denlukia/plavna-common/types';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import type { SuperForm } from 'sveltekit-superforms';
	import { generatePath } from '$lib/features/common/links';

	import type { PreviewTemplateCreationForm, PreviewTemplateEditingForm } from '../preview/parsers';
	import type { SectionUpdate } from '../section/parsers';
	import type { TranslationInsert, TranslationUpdate } from './parsers';

	type Props = {
		form:
			| SuperForm<TranslationInsert>['form']
			| SuperForm<TranslationUpdate>['form']
			| SuperForm<SectionUpdate>['form']
			| SuperForm<PreviewTemplateCreationForm>['form']
			| SuperForm<PreviewTemplateEditingForm>['form'];
		prefix?: string;
	};

	let { form, prefix = '' }: Props = $props();

	let currentLang = $state($page.params.lang as SupportedLang);
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
