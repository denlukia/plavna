<script lang="ts">
	import { getContext } from 'svelte';
	import Select from '../Select/Select.svelte';
	import SelectItem from '../Select/SelectItem.svelte';

	type SelectorLang = {
		name: string;
		code: string;
	};

	const supportedLangs = getContext<Array<SelectorLang>>('selector-languages');
</script>

<Select insideInput>
	{#each supportedLangs as lang}
		<SelectItem value={lang.code}>{lang.code.toUpperCase()}</SelectItem>
	{/each}
</Select>
