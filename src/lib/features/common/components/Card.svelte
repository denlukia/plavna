<script lang="ts">
	import type { Snippet } from 'svelte';
	import AnimatedBlock from '$lib/design/components/AnimatedBlock/AnimatedBlock.svelte';
	import Column from '$lib/design/components/Grid/Column.svelte';
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

<Column cols={2}>
	<div class="card">
		<div class="info">
			<Typography size="heading-2">
				{@render title()}
			</Typography>
			<div class="link-wrapper">
				<AnimatedBlock key={linkText} text>
					<Typography>
						<Link href={link}>{linkText}</Link>
					</Typography>
				</AnimatedBlock>
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
		align-items: center;
		flex-wrap: wrap;
		padding: var(--size-m) var(--size-m-to-l) var(--size-m-to-l) var(--size-l);
		background-color: var(--color-input-bg);
		border-radius: var(--size-xl);
		width: calc(var(--size-cell-width) * 2 + var(--size-cell-gap));
		gap: var(--size-m);
	}

	.info {
		display: flex;
		flex-direction: column;

		flex-basis: 50%;
		flex-shrink: 0;
		flex-grow: 1;
	}

	.actions {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: var(--size-s);

		flex-basis: 50%;
		flex-shrink: 0;
		flex-grow: 1;
	}

	.link-wrapper {
		margin-top: calc(-1 * var(--size-s));
	}
</style>
