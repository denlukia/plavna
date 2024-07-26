<script lang="ts">
	import { setContext } from 'svelte';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import Button from '$lib/design/components/Button/Button.svelte';
	import Checkbox from '$lib/design/components/Checkbox/Checkbox.svelte';
	import Input from '$lib/design/components/Input/Input.svelte';
	import PasswordInput from '$lib/design/components/Input/PasswordInput.svelte';
	import Label from '$lib/design/components/Label/Label.svelte';
	import Labeled from '$lib/design/components/Label/Labeled.svelte';
	import Popup from '$lib/design/components/Popup/Popup.svelte';
	import Select from '$lib/design/components/Popup/Select.svelte';
	import Spacer from '$lib/design/components/Spacer/Spacer.svelte';
	import TabItem from '$lib/design/components/Tabs/TabItem.svelte';
	import Tabs from '$lib/design/components/Tabs/Tabs.svelte';
	import Typography from '$lib/design/components/Typography/Typography.svelte';
	import AutosavedInput from '$lib/features/common/components/AutosavedInput.svelte';
	import TagSwitcher from '$lib/features/markdown/renderers/TagSwitcher.svelte';

	let { data } = $props();

	let { translationFormData } = data;

	const mockedSelectorLanguages = [
		{ name: 'English', code: 'en' },
		{ name: 'Українська', code: 'uk' }
	];

	setContext('selector-languages', mockedSelectorLanguages);

	const tabs = ['Test 1', 'Many Pelmeni'];
	let activeTabIndex = $state(0);

	const { form: translationForm, enhance: translationsEnhance } = superForm(translationFormData);

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
		<Button kind="secondary">Testy</Button>
		<Button kind="prominent">Testy</Button>
		<Button kind="destructive">Testy</Button>
		<Button href="/">Link</Button>
	</div>
	<div class="group">
		<Button size="small">Testy</Button>
		<Button size="small" kind="secondary">Testy</Button>
		<Button size="small" kind="prominent">Testy</Button>
		<Button size="small" kind="destructive">Testy</Button>
	</div>
	<div class="group">
		<Labeled>
			<Label>Тест звичайного інпуту</Label>
			<Input type="text" placeholder="Тест" />
		</Labeled>
		<Labeled>
			<Label tone="additional">Тест пароля</Label>
			<PasswordInput type="password" placeholder="Тест" />
		</Labeled>
		<!-- <Labeled>
			<Label>Тест перекладів</Label>
			<LanguagedInput superform={translationForm} />
		</Labeled> -->
		<Labeled>
			<Label>Тест автозбереження</Label>
			<AutosavedInput superValidated={translationFormData} action="?/update_translation" />
		</Labeled>
	</div>
	<div class="group">
		<Select>
			<option>Test</option>
		</Select>
		<TagSwitcher tagId={1}>Ім'я тега</TagSwitcher>
		<Labeled>
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
		gap: var(--size-labeled-inputs-gap);
		margin-bottom: var(--size-m);
		align-items: flex-start;
	}
</style>
