<script lang="ts">
	import { supportedLangs } from '@denlukia/plavna-common/constants';
	import type { SupportedLang } from '@denlukia/plavna-common/types';
	import { expoOut } from 'svelte/easing';
	import { fly, getFlyConf } from '$lib/design/transitions/fly';

	import Layers from '../ActiveElementFX/Layers.svelte';
	import type { InputProps } from './types';

	type Props = InputProps & {
		currentLang: SupportedLang;
		translationsForm: NonNullable<InputProps['translationsForm']>;
	};

	let { translationsForm, translationsPrefix = '', currentLang, ...attributes }: Props = $props();
</script>

<Layers>
	<!-- TODO: Directional transitions based on lang index -->
	{#each supportedLangs as lang}
		{#if lang !== currentLang}
			{#if attributes.type === 'textarea'}
				<textarea
					{...attributes}
					hidden
					name="{translationsPrefix}{lang}"
					bind:value={$translationsForm[lang]}
				></textarea>
			{:else}
				<input
					type="hidden"
					name="{translationsPrefix}{lang}"
					bind:value={$translationsForm[lang]}
					{...attributes}
				/>
			{/if}
		{/if}
	{/each}

	{#if attributes.type === 'textarea'}
		{#key currentLang}
			<textarea
				in:fly={getFlyConf(expoOut, 'bottom')}
				out:fly={getFlyConf(expoOut, 'top')}
				class="global-reset-input global-text-body"
				name="{translationsPrefix}{currentLang}"
				bind:value={$translationsForm[currentLang]}
				{...attributes}
			></textarea>
		{/key}
	{:else}
		{#key currentLang}
			<input
				type="text"
				in:fly={getFlyConf(expoOut, 'bottom')}
				out:fly={getFlyConf(expoOut, 'top')}
				class="global-reset-input global-text-body"
				name="{translationsPrefix}{currentLang}"
				bind:value={$translationsForm[currentLang]}
				{...attributes}
			/>
		{/key}
	{/if}
</Layers>

<style>
	/* Textareas are stilized in parent to avoid duplication */
</style>
