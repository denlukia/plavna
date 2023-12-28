<script lang="ts">
	import Input from './Input/Input.svelte';
	import Text from './Text.svelte';
	import type { LanguagedInputProps } from './Input/types';

	type Props = LanguagedInputProps & {
		infoBefore?: string;
		infoAfter?: string;
		error?: string;
		label: string;
	};

	let { label, infoBefore, infoAfter, error, ...inputProps } = $props<Props>();
</script>

<!-- svelte-ignore a11y-label-has-associated-control -->
<label class="global-line-height-reset">
	<span class="group">
		<span class="row">
			<Text size="small-short">{label}</Text>
		</span>
		{#if infoBefore}
			<span class="row global-text-additional">
				<Text size="small-short">{infoBefore}</Text>
			</span>
		{/if}
	</span>
	<Input {...inputProps} />
	{#if infoAfter || error}
		<span class="group">
			{#if infoAfter}
				<span class="row global-text-additional">
					<Text size="small-short">{infoAfter}</Text>
				</span>
			{/if}
			{#if error}
				<span class="row global-text-danger">
					<Text size="small-short">{error}</Text>
				</span>
			{/if}
		</span>
	{/if}
</label>

<style>
	.group {
		display: block;
		padding-inline: var(--size-labeled-input-info-padding-inline);
		padding-top: var(--size-labeled-input-info-padding-top);
		padding-bottom: var(--size-labeled-input-info-padding-bottom);
	}
	.row {
		display: block;
	}
</style>
