<script lang="ts">
	import { getContext } from 'svelte';

	import Dropdown from '../Dropdown.svelte';

	type SelectorLang = {
		name: string;
		code: string;
	};

	const supportedLangs = getContext<Array<SelectorLang>>('selector-languages');
</script>

<Dropdown type="in-input">
	{#each supportedLangs as lang}
		<option value={lang.code}>{lang.code.toUpperCase()}</option>
	{/each}
</Dropdown>
