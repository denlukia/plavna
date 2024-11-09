<script lang="ts">
	import { cubicOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';
	import Typography from '$lib/design/components/Typography/Typography.svelte';
	import Translation from '$lib/features/i18n/Translation.svelte';
	import { type SystemTranslationKey } from '$lib/features/i18n/types';

	type Props = {
		errors: string[] | undefined;
	};
	let { errors }: Props = $props();
</script>

{#if errors?.length}
	{#each errors as error (error)}
		<div class="error" transition:slide|global={{ duration: 500, easing: cubicOut }}>
			<Typography size="small-short" tone="danger">
				<Translation key={error as SystemTranslationKey} />
			</Typography>
		</div>
	{/each}
{/if}

<style>
	.error {
		overflow: hidden;
	}
</style>
