<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import Button from '$lib/design/components/Button/Button.svelte';
	import Typography from '$lib/design/components/Typography/Typography.svelte';
	import BlockAnimator from '$lib/features/animations/BlockAnimator.svelte';
	import { generatePath } from '$lib/features/common/links';
	import Translation from '$lib/features/i18n/Translation.svelte';

	import type { PageData } from './$types';

	type Props = {
		data: PageData;
	};

	let { data }: Props = $props();

	let { routeId } = $derived(data);
</script>

<BlockAnimator {routeId}>
	<Typography size="heading-1"><Translation key="main.landing" /></Typography>

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
</BlockAnimator>

<style>
	.actions {
		margin: var(--size-l) 0;
	}
</style>
