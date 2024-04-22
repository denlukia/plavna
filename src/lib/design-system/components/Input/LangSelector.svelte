<script lang="ts">
	import { supportedLangs } from '@denlukia/plavna-common/constants';

	import Select from '../Dropdownable/Select.svelte';
</script>

<Select isInInput>
	{#each supportedLangs as lang}
		<option value={lang}>{lang.toUpperCase()}</option>
	{/each}
</Select>
