<script lang="ts">
	import type { Snippet } from 'svelte';
	import Link from '$lib/design/components/Link/Link.svelte';
	import Typography from '$lib/design/components/Typography/Typography.svelte';

	type Props = {
		title: Snippet;
		linkText: string;
		link: string;
		actions: Snippet;
	};

	let { title, link, linkText, actions }: Props = $props();
</script>

<div class="card">
	<div class="info">
		<Typography size="headline-short">
			{@render title()}
		</Typography>
		<div class="link-wrapper">
			<Typography size="small-short">
				<Link href={link}>{linkText}</Link>
			</Typography>
		</div>
	</div>

	<div class="actions">
		{@render actions()}
	</div>
</div>

<style>
	.card {
		display: flex;
		align-items: center;
		padding-inline: var(--size-l);
		padding-block-start: var(--size-m);
		padding-block-end: var(--size-m);
		background-color: var(--color-input-bg);
		border-radius: var(--size-m-to-l);
		width: calc(var(--size-cell-width) * 2 + var(--size-cell-gap));
	}

	.info {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.actions {
		display: flex;
		align-items: center;
		gap: var(--size-s);
	}

	.link-wrapper {
		margin-top: calc(-1 * var(--size-m));
	}
</style>
