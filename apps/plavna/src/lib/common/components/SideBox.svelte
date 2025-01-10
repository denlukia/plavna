<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = {
		headerLeading?: Snippet;
		headerTrailing?: Snippet;
		content?: Snippet;
	};

	let { headerLeading, headerTrailing, content }: Props = $props();
</script>

<div class="sidebox">
	<header class="header">
		{#if headerLeading}
			<div class="leading">
				{@render headerLeading()}
			</div>
		{/if}
		{#if headerTrailing}
			<div class="trailing">
				{@render headerTrailing()}
			</div>
		{/if}
	</header>

	{#if content}
		<div class="content">
			{@render content()}
		</div>
	{/if}
</div>

<style>
	.sidebox {
		background: var(--color-sidebox-bg);
		border-radius: var(--size-sidebox-border-radius);
		border-top: var(--border-sidebox-top);
	}

	.header {
		padding: var(--size-sidebox-header-padding);
		display: flex;
		gap: var(--size-sidebox-header-gap);
		justify-content: space-between;
		align-items: center;
	}

	.leading,
	.trailing {
		display: flex;
		align-items: center;
		gap: var(--size-sidebox-header-gap);
	}

	.content {
		padding: var(--size-sidebox-content-padding);
	}
</style>
