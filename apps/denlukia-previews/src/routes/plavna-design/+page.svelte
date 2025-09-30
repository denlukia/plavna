<script lang="ts">
	import {
		Button,
		Checkbox,
		CustomPreviewWrapper,
		Input,
		Label,
		Labeled,
		Link,
		RainbowLoader,
		TabItem,
		Tabs,
		Typography
	} from '@plavna/design/components';
	import Component from '$lib/Component.svelte';

	import type { PageData } from './$types';

	type Props = {
		data: PageData;
	};

	let { data }: Props = $props();
</script>

<CustomPreviewWrapper>
	{#snippet main()}
		<div class="components">
			<Component>
				<Button>Every</Button>
			</Component>
			<Component>
				<Button kind="prominent">Great</Button>
			</Component>
			<Component><Labeled kind="for-checkbox"><Checkbox /><Label>Leap</Label></Labeled></Component>
			<Component><Input placeholder="Forward" /></Component>
			<Component><Link>Has been</Link></Component>
			<Component><Typography>Driven by</Typography></Component>
			<Component>
				<Tabs>
					<TabItem>A new</TabItem>
					<TabItem>Clarity</TabItem>
					<TabItem>Of thought</TabItem>
				</Tabs>
			</Component>
			<Component><RainbowLoader /></Component>
		</div>
	{/snippet}
</CustomPreviewWrapper>

<style>
	.components {
		display: flex;
		align-items: stretch;
		flex-wrap: wrap;
		padding: var(--size-xs);
		gap: var(--size-xs);
		height: 100%;
		background-color: hsl(30, 30%, 90%);
	}
</style>
