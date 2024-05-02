<script lang="ts">
	import { setContext } from 'svelte';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import Button from '$lib/design-system/components/Button.svelte';
	import Checkbox from '$lib/design-system/components/Checkbox.svelte';
	import Input from '$lib/design-system/components/Input/Input.svelte';
	import LabeledInput from '$lib/design-system/components/Label/LabeledInput.svelte';
	import Popup from '$lib/design-system/components/Popup/Popup.svelte';
	import Select from '$lib/design-system/components/Popup/Select.svelte';
	import Spacer from '$lib/design-system/components/Spacer.svelte';
	import Switch from '$lib/design-system/components/Switch/Switch.svelte';
	import TabItem from '$lib/design-system/components/Tabs/TabItem.svelte';
	import Tabs from '$lib/design-system/components/Tabs/Tabs.svelte';
	import Typography from '$lib/design-system/components/Typography/Typography.svelte';

	let { data } = $props();

	let { translationFormData } = data;

	const mockedSelectorLanguages = [
		{ name: 'English', code: 'en' },
		{ name: 'Українська', code: 'uk' }
	];

	setContext('selector-languages', mockedSelectorLanguages);

	const tabs = ['Test 1', 'Many Pelmeni'];
	let activeTabIndex = $state(0);

	const { form: translationForm } = superForm(translationFormData);

	// Popup
	let active = $state(false);
</script>

<div class="blocks">
	<div class="group">
		<Typography block size="heading-1">denis lukianenko</Typography>
		<Typography block size="heading-2">денис лукʼяненко<br />це фронтенд розробник</Typography>
		<Typography block size="headline">Тестовий <br /> текст</Typography>
		<Typography block size="headline-short">Тестовий <br /> текст</Typography>
		<Typography block size="body"
			>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Neque quas nesciunt ratione iste
			<br />
			eveniet. Dolorem officia suscipit veniam voluptas minima amet consequuntur neque nihil maiores
			<br />
			hic sed, laborum laboriosam quod.
		</Typography>
		<Typography block size="body-short">
			Lorem, ipsum dolor sit amet consectetur adipisicing elit. Neque quas nesciunt ratione iste
			<br />
			eveniet. Dolorem officia suscipit veniam voluptas minima amet consequuntur neque nihil maiores
			<br />
			hic sed, laborum laboriosam quod.
		</Typography>
		<Typography block size="small">Тестовий <br /> текст</Typography>
		<Typography block size="small-short">Тестовий <br /> текст</Typography>
	</div>
	<div class="group">
		<Button>Testy</Button>
		<Button type="secondary">Testy</Button>
		<Button type="prominent">Testy</Button>
		<Button type="destructive">Testy</Button>
		<Button href="/">Link</Button>
	</div>
	<div class="group">
		<Button size="small">Testy</Button>
		<Button size="small" type="secondary">Testy</Button>
		<Button size="small" type="prominent">Testy</Button>
		<Button size="small" type="destructive">Testy</Button>
	</div>
	<div class="group">
		<LabeledInput>
			<Typography size="small-short">Тест</Typography>
			<Typography size="small-short" tone="additional">Тест</Typography>
			<Input type="password" placeholder="Тест" />
			<Input translations={translationForm} />
		</LabeledInput>
	</div>
	<div class="group">
		<Select>
			<option>Test</option>
		</Select>
		<LabeledInput type="horizontal">
			<Switch />
			<Typography>Тест</Typography>
		</LabeledInput>
		<LabeledInput type="switch-with-bg">
			<Typography size="heading-2">Тест</Typography>
			<Switch />
		</LabeledInput>
		<LabeledInput type="horizontal">
			<Checkbox />
			<Typography>Тест</Typography>
		</LabeledInput>
		<Tabs>
			{#each tabs as tab, index}
				<TabItem onclick={() => (activeTabIndex = index)} active={index === activeTabIndex}>
					{tab}
				</TabItem>
			{/each}
		</Tabs>
	</div>
	<div class="group">
		<Popup triggerType="button" bind:active>
			{#snippet label()}
				Test
			{/snippet}
			{#snippet content()}
				<Typography size="heading-2">Тест</Typography>
				<Input placeholder="Тест" />
				<Spacer />
				<Button>Let's Go!</Button>
			{/snippet}
		</Popup>
	</div>
</div>

<style>
	.group {
		display: flex;
		flex-wrap: wrap;
		gap: var(--size-m);
		margin-bottom: var(--size-m);
		align-items: flex-start;
	}
</style>
