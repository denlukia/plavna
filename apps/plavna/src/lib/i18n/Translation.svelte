<script lang="ts">
	import { getGlobalTypographyClass, Typography } from '@plavna/design/components';
	import { page } from '$app/stores';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { SystemTranslationKey } from '$lib/i18n/types';
	import { getLang, getRecordTranslation, getSystemTranslation } from '$lib/i18n/utils';

	import BasicMarkdown from '../markdown/BasicMarkdown.svelte';
	import Markdown from '../markdown/Markdown.svelte';
	import type { TranslationSelect, TranslationUpdate } from './validators';

	type FormTranslation = {
		superValidated: SuperValidated<Omit<TranslationUpdate, 'key'>> | undefined;
		recordKey?: null;
		key?: null;
	};
	type RecordTranslation = {
		recordKey: TranslationSelect['key'] | undefined;
		key?: null;
		superValidated?: null;
	};
	type SystemTranslation = {
		key: SystemTranslationKey | undefined;
		superValidated?: null;
		recordKey?: null;
	};
	type Props = {
		markdown?: boolean | 'basic';
		markdownRemoveEmptyLinks?: boolean;
		wrapInTypography?: boolean;
		showNoTranslation?: boolean;
		wrapTranslation?: (md: string) => string;
	} & (FormTranslation | RecordTranslation | SystemTranslation);

	let {
		superValidated,
		key,
		recordKey,
		wrapInTypography,
		showNoTranslation = true,
		markdown = false,
		wrapTranslation = (md) => md
	}: Props = $props();

	let noTranslationText = $derived(
		getSystemTranslation('layout.no_translation', $page.data.systemTranslations) || '...'
	);

	function getTranslation() {
		if (superValidated) return superValidated.data[getLang($page.params.lang)];
		if (typeof key === 'string') return getSystemTranslation(key, $page.data.systemTranslations);
		if (typeof recordKey === 'number')
			return getRecordTranslation(recordKey, $page.data.recordsTranslationsState?.value);
	}

	let translation = $derived.by(getTranslation);

	let wrappedTranslation = $derived(translation && wrapTranslation(translation));
</script>

{#if wrappedTranslation}
	{#if markdown === 'basic'}
		<BasicMarkdown source={wrappedTranslation} />
	{:else if markdown}
		<Markdown source={wrappedTranslation} />
	{:else}
		{@html wrappedTranslation}
	{/if}
{:else if showNoTranslation}
	{#if wrapInTypography}
		<Typography size="body" tone="additional">{noTranslationText}</Typography>
	{:else}
		<span
			class="global-text-additional {getGlobalTypographyClass(markdown ? 'markdown' : 'interface')}"
		>
			{noTranslationText}
		</span>
	{/if}
{/if}
