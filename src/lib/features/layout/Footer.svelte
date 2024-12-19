<script lang="ts">
	import { page } from '$app/stores';
	import { fade } from 'svelte/transition';
	import Layers from '$lib/design/components/ActiveElementFX/Layers.svelte';
	import Link from '$lib/design/components/Link/Link.svelte';
	import logomark from '$lib/features/layout/logo/mark.svg?raw';

	import { generatePath } from '../common/links';

	type Props = {
		logoTextSvg: string | null;
	};

	let { logoTextSvg }: Props = $props();

	let linkToMain = generatePath('/[lang]/', $page.params);
</script>

<footer>
	<Link href={linkToMain} class="logo-link">
		<span class="logotype">
			<span class="logomark">{@html logomark}</span>
			{#if logoTextSvg}
				<Layers>
					{#key logoTextSvg}
						<span class="logotext" transition:fade>{@html logoTextSvg}</span>
					{/key}
				</Layers>
			{/if}
		</span>
	</Link>
</footer>

<style>
	footer {
		padding-top: 100px;
	}
	footer :global(.logo-link) {
		display: inline-flex;
		justify-content: flex-end;
		font-size: 48px;
		line-height: 1em;
		padding-inline: 4px;
		color: var(--color-text);

		--color-link-shadow: var(--color-text-barely-visible);
		--shadow-link: inset 0 -1px 0px var(--color-link-shadow);
		box-shadow: var(--shadow-link);
	}
	footer :global(.logo-link:hover) {
		--color-link-hovered-shadow: var(--color-text-barely-visible);
		--shadow-link-hovered: inset 0 -1.5em 0px var(--color-link-hovered-shadow);
		box-shadow: var(--shadow-link-hovered);
	}
	.logotype {
		display: inline-flex;
		align-items: flex-end;
	}
	.logomark > :global(svg) {
		height: 35px;
	}
	.logotext {
		margin-left: 5px;
	}
	.logotext > :global(svg) {
		height: 26px;
		margin-bottom: -6.5px;
	}
</style>
