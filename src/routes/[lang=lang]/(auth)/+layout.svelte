<script lang="ts">
	import { page } from '$app/stores';
	import Translation from '$lib/components/Translation.svelte';
	import Layers from '$lib/design-system/components/Layers/Layers.svelte';
	import Spacer from '$lib/design-system/components/Spacer.svelte';
	import TabItem from '$lib/design-system/components/Tabs/TabItem.svelte';
	import Tabs from '$lib/design-system/components/Tabs/Tabs.svelte';
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
	};

	let { children } = $props<Props>();
</script>

<main class="auth-layout">
	<Tabs size="heading-2">
		<TabItem active={$page.url.pathname.includes('signup')} href="./signup">
			<Translation key="signup" />
		</TabItem>
		<TabItem active={$page.url.pathname.includes('login')} href="./login">
			<Translation key="login" />
		</TabItem>
	</Tabs>
	<Spacer size="l" />
	<Layers>
		{@render children()}
	</Layers>
</main>

<style>
	.auth-layout {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 75px;
	}
</style>
