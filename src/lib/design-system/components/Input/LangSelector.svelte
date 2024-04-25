<script lang="ts">
	import { supportedLangs } from '@denlukia/plavna-common/constants';

	import Select from '../Dropdownable/Select.svelte';

	type Props = {
		value: string;
	};

	let { value = $bindable() }: Props = $props();
</script>

<Select isInInput bind:value>
	{#each supportedLangs as lang}
		<option value={lang}>{lang.toUpperCase()}</option>
	{/each}
</Select>
