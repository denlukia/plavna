<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	import TriggerStyler from './TriggerStyler.svelte';

	type Props = HTMLAttributes<HTMLSelectElement> & {
		children: Snippet;
		isInInput?: boolean;
		value?: string | null;
	};

	let { children, isInInput = false, value = $bindable(), ...attributes }: Props = $props();
</script>

<TriggerStyler isLabel {isInInput}>
	<select
		bind:value
		class="
			global-reset-select
			global-disable-default-outline
			{isInInput ? 'global-dropdown-in-input-paddings' : 'global-dropdown-paddings'}"
		{...attributes}
	>
		{@render children()}
	</select>
</TriggerStyler>
