<script lang="ts">
	import { page } from '$app/stores';

	import { defaultLang, supportedLanguages } from '$lib/client-server/languages';

	export let prefix: string;
	export let currentLang = $page.params.lang || defaultLang;
	export let form: any;
</script>

<input type="hidden" name="{prefix}._id" value={form?.[`${prefix}._id`] ?? null} />
{#each supportedLanguages as language}
	{@const prefixedName = `${prefix}.${language}`}
	<input
		type={currentLang === language ? 'text' : 'hidden'}
		name={prefixedName}
		placeholder="Текст {prefix}"
		value={form?.[prefixedName] ?? null}
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
