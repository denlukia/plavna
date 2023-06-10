<script lang="ts">
	import { page } from '$app/stores';
	import { number } from 'zod';

	import { type SupportedLang, supportedLanguages } from '$lib/common/languages';

	export let prefix: string;
	export let currentLang = $page.params.lang;
	export let initial: ({ _id: number } & { [key in SupportedLang]: string | null }) | undefined;
</script>

<input type="hidden" name="{prefix}._id" value={initial?._id ?? null} />
{#each supportedLanguages as language}
	<input
		type={currentLang === language ? 'text' : 'hidden'}
		name="{prefix}.{language}"
		placeholder="Текст {prefix}"
		value={initial?.[language] || null}
	/>
{/each}
{#each supportedLanguages as language}
	<button
		type="button"
		on:click={() => (currentLang = language)}
		style="font-weight: {currentLang === language ? 'bold' : 'normal'};"
	>
		{language}
	</button>
{/each}
