<script lang="ts">
	import type { Snippet } from 'svelte';

	import Box from './Box.svelte';
	import TriggerStyler from './TriggerStyler.svelte';

	type Props = {
		triggerType?: 'button' | 'dropdown';
		label: Snippet;
		content: Snippet;
		opened?: boolean;
	};

	let { triggerType = 'button', opened, label, content }: Props = $props();

	function onclick() {
		opened = !opened;
	}
</script>

<div class="popup-group">
	<TriggerStyler>
		<button class="trigger global-reset-button global-dropdown-paddings" {onclick}>
			{@render label()}
		</button>
	</TriggerStyler>
	{#if opened}
		<div class="popup-positioner">
			<Box withGaps>
				{@render content()}
			</Box>
		</div>
	{/if}
</div>

<style>
	.trigger {
		font-family: var(--text-body-short-font-family);
		font-size: var(--text-body-short-size);
		font-weight: var(--text-body-short-weight);
		line-height: var(--text-body-short-line-height);
		letter-spacing: var(--text-body-short-letter-spacing);
	}
	.popup-group {
		position: relative;
	}
	.popup-positioner {
		position: absolute;
		bottom: 0%;
		left: 50%;
		width: max-content;
		max-width: 200px;
		transform: translate(-50%, 100%);
	}
</style>
