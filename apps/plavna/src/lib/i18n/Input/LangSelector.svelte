<script lang="ts">
	import { Select } from '@plavna/design/components';
	import { supportedLangs } from '@plavna/image-uploader/constants';

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
