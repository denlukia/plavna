<script lang="ts">
	import { Button, Popup } from '@plavna/design/components';
	import { page } from '$app/stores';
	import type { User } from 'lucia';
	import { generatePath } from '$lib/common/links.js';
	import Translation from '$lib/i18n/Translation.svelte';

	type Props = {
		actor: User;
	};

	let { actor }: Props = $props();

	const pages = $derived([
		{
			template: '/[lang]/[username]/pages',
			translation: 'layout.my_items.pages'
		} as const,
		{
			template: '/[lang]/[username]/articles',
			translation: 'layout.my_items.articles'
		} as const,
		{
			template: '/[lang]/[username]/settings',
			translation: 'layout.my_items.settings'
		} as const
	]);

	let currentPathname = $derived($page.url.pathname);
</script>

<Popup kind="list" position={{ x: 'left' }}>
	{#snippet label()}
		<span class="label-wrapper">
			<Translation key="layout.my" />
		</span>
	{/snippet}
	{#snippet content()}
		{#each pages as { template, translation }}
			<Button
				href={generatePath(template, $page.params, { username: actor.username })}
				kind={currentPathname === generatePath(template, $page.params, { username: actor.username })
					? 'primary'
					: 'secondary'}
			>
				<Translation key={translation} />
			</Button>
		{/each}
	{/snippet}
</Popup>
