<script lang="ts">
	import AnimatedPage from '@plavna/design/components/AnimatedPage/AnimatedPage.svelte';
	import Button from '@plavna/design/components/Button/Button.svelte';
	import Column from '@plavna/design/components/Grid/Column.svelte';
	import ColumnsContainer from '@plavna/design/components/Grid/ColumnsContainer.svelte';
	import Typography from '@plavna/design/components/Typography/Typography.svelte';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { generatePath } from '$lib/features/common/links';
	import Translation from '$lib/features/i18n/Translation.svelte';

	import type { PageData } from './$types';

	type Props = {
		data: PageData;
	};

	let { data }: Props = $props();

	let { routeId, lang } = $derived(data);
</script>

<AnimatedPage key={routeId + lang}>
	<ColumnsContainer>
		<Column cols={3}>
			<Typography size="heading-2"><Translation key="main.landing" markdown /></Typography>
		</Column>
	</ColumnsContainer>

	<div class="actions">
		{#if data.actor}
			<form use:enhance method="POST">
				<Button><Translation key="main.to_sign_out" /></Button>
			</form>
		{:else}
			<Button href={generatePath('/[lang]/sign-in/github', $page.params)} dataSvelteKitReload>
				<Translation key="main.sign_in_with_github" />
			</Button>
		{/if}
	</div>
</AnimatedPage>

<style>
	.actions {
		margin: var(--size-l) 0;
	}
</style>
