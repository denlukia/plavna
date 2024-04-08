<script lang="ts">
	import { cubicOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';
	import { type SystemTranslationKey } from '$lib/(features)/common/translations/_types';
	import Translation from '$lib/components/Translation.svelte';
	import Typography from '$lib/design-system/components/Typography.svelte';

	type Props = {
		errors: string[] | undefined;
	};
	let { errors }: Props = $props();
</script>

{#if errors?.length}
	{#each errors as error (error)}
		<div class="error" transition:slide|global={{ easing: cubicOut }}>
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
