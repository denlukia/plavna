<script>
	import { setContext } from 'svelte';
	import Box from '$lib/design-system/components/Box.svelte';
	import Button from '$lib/design-system/components/Button.svelte';
	import Checkbox from '$lib/design-system/components/Checkbox.svelte';
	import Dropdown from '$lib/design-system/components/Dropdown.svelte';
	import Grid from '$lib/design-system/components/Grid.svelte';
	import Input from '$lib/design-system/components/Input/Input.svelte';
	import Labeled from '$lib/design-system/components/Labeled.svelte';
	import Layers from '$lib/design-system/components/Layers/Layers.svelte';
	import Spacer from '$lib/design-system/components/Spacer.svelte';
	import Switch from '$lib/design-system/components/Switch/Switch.svelte';
	import TabItem from '$lib/design-system/components/Tabs/TabItem.svelte';
	import Tabs from '$lib/design-system/components/Tabs/Tabs.svelte';
	import Text from '$lib/design-system/components/Text.svelte';

	const mockedSelectorLanguages = [
		{ name: 'English', code: 'en' },
		{ name: 'Українська', code: 'uk' }
	];

	setContext('selector-languages', mockedSelectorLanguages);

	const tabs = ['Test 1', 'Many Pelmeni'];

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
			<Labeled>
				<Text size="small-short">Тест</Text>
				<Text size="small-short" tone="additional">Тест</Text>
				<Input type="password" placeholder="Тест" />
			</Labeled>
		</div>
		<div class="group">
			<Dropdown>
				<option>Test</option>
			</Dropdown>
			<Labeled type="horizontal">
				<Switch />
				<Text size="body-short">Тест</Text>
			</Labeled>
			<Labeled type="switch-with-bg">
				<Text size="heading-2">Тест</Text>
				<Switch />
			</Labeled>
			<Labeled type="horizontal">
				<Checkbox />
				<Text>Тест</Text>
			</Labeled>
			<Tabs>
				{#each tabs as tab, index}
					<TabItem onclick={() => (activeTabIndex = index)} active={index === activeTabIndex}>
						{tab}
					</TabItem>
				{/each}
			</Tabs>
		</div>
		<div class="group">
			<Box>
				<Text size="heading-2">Тест</Text>
				<Input placeholder="Тест" />

				<Spacer size="l" />
				<Button>Let's Go!</Button>
			</Box>
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
