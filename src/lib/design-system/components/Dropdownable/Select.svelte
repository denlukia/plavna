<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	import TriggerStyler from './TriggerStyler.svelte';

	type Props = HTMLAttributes<HTMLSelectElement> & {
		children: Snippet;
		isInInput?: boolean;
	};

	let { children, isInInput = false, ...other }: Props = $props();
</script>

<TriggerStyler isLabel {isInInput}>
	<select
		class={`
			select 
			global-reset-select 
			global-disable-default-outline 
			global-text-${isInInput ? 'small-short' : 'body-short'}
			${isInInput ? 'global-dropdown-in-input-paddings' : 'global-dropdown-paddings'}`}
		{...other}
	>
		{@render children()}
	</select>
</TriggerStyler>
