<script>
	import Button from '$lib/design-system/components/Button.svelte';
	import Checkbox from '$lib/design-system/components/Checkbox.svelte';
	import Grid from '$lib/design-system/components/Grid.svelte';
	import Input from '$lib/design-system/components/Input/Input.svelte';
	import Label from '$lib/design-system/components/Labeled.svelte';
	import Layers from '$lib/design-system/components/Layers/Layers.svelte';
	import Select from '$lib/design-system/components/Select/Select.svelte';
	import SelectItem from '$lib/design-system/components/Select/SelectItem.svelte';
	import Switch from '$lib/design-system/components/Switch/Switch.svelte';
	import TabItem from '$lib/design-system/components/Tabs/TabItem.svelte';
	import Tabs from '$lib/design-system/components/Tabs/Tabs.svelte';
	import Text from '$lib/design-system/components/Text.svelte';
	import { setContext } from 'svelte';

	const mockedSelectorLanguages = [
		{ name: 'English', code: 'en' },
		{ name: 'Українська', code: 'uk' }
	];

	setContext('selector-languages', mockedSelectorLanguages);

	const tabs = ['Test 1', 'Test 2'];

	let activeTabIndex = $state(0);
</script>

<Layers>
	<div class="blocks">
		<div class="group">
			<Text block size="heading-1">denis lukianenko</Text>
			<Text block size="heading-2">денис лукʼяненко<br />це фронтенд розробник</Text>
			<Text block size="headline">Тестовий <br /> текст</Text>
			<Text block size="headline-short">Тестовий <br /> текст</Text>
			<Text block size="body">Тестовий <br /> текст</Text>
			<Text block size="body-short">Тестовий <br /> текст</Text>
			<Text block size="small">Тестовий <br /> текст</Text>
			<Text block size="small-short">Тестовий <br /> текст</Text>
		</div>
		<div class="group">
			<Button bold>Testy</Button>
			<Button type="secondary" bold>Testy</Button>
			<Button type="prominent" bold>Testy</Button>
			<Button type="destructive" bold>Testy</Button>
		</div>
		<div class="group">
			<Button size="small" bold>Testy</Button>
			<Button size="small" type="secondary" bold>Testy</Button>
			<Button size="small" type="prominent" bold>Testy</Button>
			<Button size="small" type="destructive" bold>Testy</Button>
		</div>
		<div class="group">
			<Label type="vertical">
				<Text size="small-short">Тест</Text>
				<Text size="small-short" tone="additional">Тест</Text>
				<Input type="password" placeholder="Тест" />
			</Label>
		</div>
		<div class="group">
			<Select>
				<SelectItem>Test</SelectItem>
			</Select>
			<Label>
				<Switch />
				<Text size="body-short">Тест</Text>
			</Label>
			<Label type="switch-with-bg">
				<Text size="heading-2">Тест</Text>
				<Switch />
			</Label>
			<Label>
				<Checkbox />
				<Text>Тест</Text>
			</Label>
			<Tabs>
				{#each tabs as tab, index}
					<TabItem onclick={() => (activeTabIndex = index)} active={index === activeTabIndex}>
						{tab}
					</TabItem>
				{/each}
			</Tabs>
		</div>
	</div>
	<Grid />
</Layers>

<style>
	.group {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-bottom: 10px;
		align-items: flex-start;
	}
</style>
