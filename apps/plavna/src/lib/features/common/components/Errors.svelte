<script lang="ts">
	import { Label } from '@plavna/design/components';
	import { cubicOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';
	import type { ValidationErrors } from 'sveltekit-superforms';
	import Translation from '$lib/features/i18n/Translation.svelte';
	import { type SystemTranslationKey } from '$lib/features/i18n/types';

	import { isNonNullable } from '../utils';

	type GeneralValidationErrors = ValidationErrors<{ [key: string]: any }>;

	type Props = {
		errors: GeneralValidationErrors[string] | GeneralValidationErrors;
	};
	let { errors }: Props = $props();

	let normalizedErrors = $derived.by(() => {
		if (Array.isArray(errors)) {
			return errors;
		}
		if (errors) {
			return Object.values(errors).flat().filter(isNonNullable);
		}
		return [];
	});
</script>

{#each normalizedErrors as error (error)}
	<span class="error" transition:slide|global={{ duration: 250, easing: cubicOut }}>
		<Label tone="danger">
			<Translation key={error as SystemTranslationKey} />
		</Label>
	</span>
{/each}

<style>
	.error {
		display: inline-flex;
		overflow: hidden;
	}
</style>
