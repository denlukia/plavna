<script lang="ts">
	import { supportedLangs } from '@plavna/image-uploader/constants';

	import Select from '../../../design/components/Popup/Select.svelte';

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
