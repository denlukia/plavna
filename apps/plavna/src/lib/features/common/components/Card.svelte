<script lang="ts">
	import { Column, Link, Typography } from '@plavna/design/components';
	import type { Snippet } from 'svelte';

	type Props = {
		title: Snippet;
		linkText: string;
		link: string;
		actions: Snippet;
	};

	let { title, link, linkText, actions }: Props = $props();
</script>

<Column cols={2} stretch>
	<div class="card">
		<div class="info">
			<Typography size="heading-2">
				{@render title()}
			</Typography>
			<div class="link-wrapper">
				<Typography>
					<Link href={link}>{linkText}</Link>
				</Typography>
			</div>
		</div>

		<div class="actions">
			{@render actions()}
		</div>
	</div>
</Column>

<style>
	.card {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: var(--size-m) var(--size-m-to-l) var(--size-m-to-l) var(--size-l);
		background-color: var(--color-input-bg);
		border-radius: var(--size-xl);
		width: calc(var(--size-cell-width) * 2 + var(--size-cell-gap));
		gap: var(--size-m);
		height: 100%;
	}

	.info {
		display: flex;
		flex-direction: column;
	}

	.actions {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: var(--size-s);
	}
</style>
