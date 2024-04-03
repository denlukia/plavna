<script>
	import { setContext } from 'svelte';
	import Layers from '$lib/design-system/components/(helpers)/Layers.svelte';
	import Button from '$lib/design-system/components/Button.svelte';
	import Checkbox from '$lib/design-system/components/Checkbox.svelte';
	import Box from '$lib/design-system/components/Dropdownable/Box.svelte';
	import Select from '$lib/design-system/components/Dropdownable/Select.svelte';
	import Grid from '$lib/design-system/components/Grid.svelte';
	import Input from '$lib/design-system/components/Input/Input.svelte';
	import Labeled from '$lib/design-system/components/Labeled.svelte';
	import Spacer from '$lib/design-system/components/Spacer.svelte';
	import Switch from '$lib/design-system/components/Switch/Switch.svelte';
	import TabItem from '$lib/design-system/components/Tabs/TabItem.svelte';
	import Tabs from '$lib/design-system/components/Tabs/Tabs.svelte';
	import Typography from '$lib/design-system/components/Typography.svelte';

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
			<Typography block size="heading-1">denis lukianenko</Typography>
			<Typography block size="heading-2">денис лукʼяненко<br />це фронтенд розробник</Typography>
			<Typography block size="headline">Тестовий <br /> текст</Typography>
			<Typography block size="headline-short">Тестовий <br /> текст</Typography>
			<Typography block size="body">Тестовий <br /> текст</Typography>
			<Typography block size="body-short"
				>Тестовий чудовий текст дає<br /> вам зрозуміти читаємість тексту</Typography
			>
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
			<Labeled>
				<Typography size="small-short">Тест</Typography>
				<Typography size="small-short" tone="additional">Тест</Typography>
				<Input type="password" placeholder="Тест" />
			</Labeled>
		</div>
		<div class="group">
			<Select>
				<option>Test</option>
			</Select>
			<Labeled type="horizontal">
				<Switch />
				<Typography>Тест</Typography>
			</Labeled>
			<Labeled type="switch-with-bg">
				<Typography size="heading-2">Тест</Typography>
				<Switch />
			</Labeled>
			<Labeled type="horizontal">
				<Checkbox />
				<Typography>Тест</Typography>
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
				<Typography size="heading-2">Тест</Typography>
				<Input placeholder="Тест" />
				<Spacer size="m" />
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
		gap: var(--size-m);
		margin-bottom: var(--size-m);
		align-items: flex-start;
	}
</style>
