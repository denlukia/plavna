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
	{#key currentLanguage}
		{#if attributes.type === 'textarea'}
			<textarea
				rows="5"
				in:fly={getFlyConf(expoOut, 'top')}
				out:fly={getFlyConf(expoOut, 'bottom')}
				class="global-reset-input global-text-body"
				name="{translationsPrefix}{currentLanguage}"
				bind:value={$translations[currentLanguage]}
				{...attributes}
			></textarea>
		{:else}
			<input
				type="text"
				in:fly={getFlyConf(expoOut, 'top')}
				out:fly={getFlyConf(expoOut, 'bottom')}
				class="global-reset-input global-text-body"
				name="{translationsPrefix}{currentLanguage}"
				bind:value={$translations[currentLanguage]}
				{...attributes}
			/>
		{/if}
	{/key}
</Layers>

<style>
	textarea {
		min-height: calc(
			var(--text-body-padding-top) + var(--text-body-line-height) * 2 +
				var(--text-body-padding-bottom)
		);
		min-width: calc(var(--size-column-width) - var(--size-3xl));

		max-height: calc(
			var(--text-body-padding-top) + var(--text-body-line-height) * 10 +
				var(--text-body-padding-bottom)
		);
		max-width: calc(var(--size-column-width) * 2);
	}
	textarea::-webkit-resizer {
		/* background-repeat: no-repeat;
		background-position: bottom right;
		background-image: url("data:image/svg+xml,%3Csvg width='8' height='8' viewBox='0 0 8 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 1V1C7 4.31371 4.31371 7 1 7V7' stroke='hsla(0deg, 0%, 0%, 0.25)' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E%0A");
	 */

		display: none;
	}
</style>
