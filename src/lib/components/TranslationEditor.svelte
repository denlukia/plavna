<script lang="ts">
	import { defaultLang, supportedLanguages } from '$lib/common/languages';

	export let prefix: string;
	export let id: number | undefined;
	export let currentLang = defaultLang;
</script>

<input type="hidden" name="{prefix}._id" value={id || null} />
{#each supportedLanguages as language}
	<button
		type="button"
		on:click={() => (currentLang = language)}
		style="font-weight: {currentLang === language ? 'bold' : 'normal'};"
	>
		{language}
	</button>
{/each}
{#each supportedLanguages as language}
	<input
		type={currentLang === language ? 'text' : 'hidden'}
		name="{prefix}.{language}"
		placeholder="Текст {prefix}"
	/>
{/each}
