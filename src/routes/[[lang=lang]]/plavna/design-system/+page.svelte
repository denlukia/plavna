<script>
	import Button from '$lib/design-system/components/Button.svelte';
	import Grid from '$lib/design-system/components/Grid.svelte';
	import Input from '$lib/design-system/components/Input/Input.svelte';
	import Layers from '$lib/design-system/components/Layers.svelte';
	import Text from '$lib/design-system/components/Text.svelte';
</script>

<Layers>
	<div class="blocks">
		<div class="texts">
			<Text block size="heading-1"><i>denis lukianenko</i></Text>
			<Text block size="heading-2"><i>Фрустрація<br />текст</i></Text>
			<Text block size="headline">Тестовий <br /> текст</Text>
			<Text block size="headline-short">Тестовий <br /> текст</Text>
			<Text block size="body">Тестовий <br /> текст</Text>
			<Text block size="body-short">Тестовий <br /> текст</Text>
			<Text block size="small">Тестовий <br /> текст</Text>
			<Text block size="small-short">Тестовий <br /> текст</Text>
		</div>
		<div class="components">
			<div class="buttons">
				<Button bold>Testy</Button>
				<Button type="secondary" bold>Testy</Button>
				<Button type="prominent" bold>Testy</Button>
				<Button type="destructive" bold>Testy</Button>
			</div>
			<div class="buttons">
				<Button size="small" bold>Testy</Button>
				<Button size="small" type="secondary" bold>Testy</Button>
				<Button size="small" type="prominent" bold>Testy</Button>
				<Button size="small" type="destructive" bold>Testy</Button>
			</div>
			<div class="inputs">
				<Input />
				<Input type="password" />
			</div>
		</div>
	</div>
	<Grid />
</Layers>

<style>
	.texts {
		gap: 10px;
		display: flex;
		align-items: flex-start;
	}
	.components {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	.buttons {
		line-height: 0;
	}
</style>
