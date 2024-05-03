<script lang="ts">
	import { supportedLangs } from '@denlukia/plavna-common/constants';
	import type { SupportedLang } from '@denlukia/plavna-common/types';
	import { expoOut } from 'svelte/easing';
	import { fly, getFlyConf } from '$lib/design-system/transitions/fly';

	import Layers from '../ActiveElementFX/Layers.svelte';
	import type { InputProps } from './types';

	type Props = InputProps & {
		currentLanguage: SupportedLang;
		translations: NonNullable<InputProps['translations']>;
	};

	let { translations, translationsPrefix = '', currentLanguage, ...attributes }: Props = $props();
</script>

<Layers>
	<!-- TODO Directional transitions based on lang index -->
	{#each supportedLangs as lang}
		{#if lang !== currentLanguage}
			{#if attributes.type === 'textarea'}
				<textarea
					{...attributes}
					hidden
					name="{translationsPrefix}{lang}"
					bind:value={$translations[lang]}
				></textarea>
			{:else}
				<input
					type="hidden"
					name="{translationsPrefix}{lang}"
					bind:value={$translations[lang]}
					{...attributes}
				/>
			{/if}
		{/if}
	{/each}

	{#if attributes.type === 'textarea'}
		{#key currentLanguage}
			<textarea
				in:fly={getFlyConf(expoOut, 'bottom')}
				out:fly={getFlyConf(expoOut, 'top')}
				class="global-reset-input global-text-body"
				name="{translationsPrefix}{currentLanguage}"
				bind:value={$translations[currentLanguage]}
				{...attributes}
			></textarea>
		{/key}
	{:else}
		{#key currentLanguage}
			<input
				type="text"
				in:fly={getFlyConf(expoOut, 'bottom')}
				out:fly={getFlyConf(expoOut, 'top')}
				class="global-reset-input global-text-body"
				name="{translationsPrefix}{currentLanguage}"
				bind:value={$translations[currentLanguage]}
				{...attributes}
			/>
		{/key}
	{/if}
</Layers>

<style>
	/* Textareas are stilized in parent to avoid duplication */
</style>
