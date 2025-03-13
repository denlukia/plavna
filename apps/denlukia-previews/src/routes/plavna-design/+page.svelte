<script lang="ts">
	import { Button, CustomPreviewWrapper } from '@plavna/design/components';
	import { ThemeContextProvider } from '@plavna/design/theming/components';
	import Component from '$lib/Component.svelte';

	import '@plavna/design/theming/styles';

	import type { PageData } from './$types';

	type Props = {
		data: PageData;
	};

	let { data }: Props = $props();

	let { dsThemeComponentSet, themeSet } = $derived(data);
</script>

<ThemeContextProvider {themeSet} components={{ designSystem: dsThemeComponentSet }}>
	<CustomPreviewWrapper>
		{#snippet main()}
			<div class="components">
				<Component>
					<Button>Button 1</Button>
				</Component>
			</div>
		{/snippet}
	</CustomPreviewWrapper>
</ThemeContextProvider>

<style>
	.components {
		display: flex;
		align-items: flex-start;
		flex-wrap: wrap;
		gap: var(--size-xs);
		height: 100%;
		background-color: hsl(30, 30%, 90%);
	}
</style>
