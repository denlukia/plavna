<script lang="ts">
	import { page } from '$app/stores';
	import type { SuperValidated } from 'sveltekit-superforms';
	import AnimatedBlock from '$lib/design/components/AnimatedBlock/AnimatedBlock.svelte';
	import type { SystemTranslationKey } from '$lib/features/i18n/types';
	import { getLang, getRecordTranslation, getSystemTranslation } from '$lib/features/i18n/utils';

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
		markdown?: boolean;
	} & (FormTranslation | RecordTranslation | SystemTranslation);

	let { superValidated, key, recordKey, markdown = false }: Props = $props();

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
</script>

<AnimatedBlock key={translation + noTranslationText}>
	{#if translation}
		{#if markdown}
			<Markdown source={translation} />
		{:else}
			{@html translation}
		{/if}
	{:else}
		<span class="no-translation">{noTranslationText}</span>
	{/if}
</AnimatedBlock>

<style>
	.no-translation {
		opacity: 0.25;
	}
</style>
