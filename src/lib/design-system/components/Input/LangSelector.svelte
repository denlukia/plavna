<script lang="ts">
	import { getContext } from 'svelte';

	import Trigger from '../Dropdownable/TriggerStyler.svelte';

	type SelectorLang = {
		name: string;
		code: string;
	};

	const supportedLangs = getContext<Array<SelectorLang>>('selector-languages');
</script>

<Trigger isInInput>
	{#each supportedLangs as lang}
		<option value={lang.code}>{lang.code.toUpperCase()}</option>
	{/each}
</Trigger>
