<script lang="ts">
	import { page } from '$app/stores';
	import type { User } from 'lucia';
	import Button from '$lib/design/components/Button/Button.svelte';
	import Popup from '$lib/design/components/Popup/Popup.svelte';
	import { generatePath } from '$lib/features/common/links.js';
	import Translation from '$lib/features/i18n/Translation.svelte';

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

<Popup kind="list">
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

<Button
	kind="prominent"
	href={generatePath('/[lang]/[username]/new', $page.params, { username: actor.username })}
	dataSvelteKitPreloadData="off"
>
	<Translation key="layout.new_article" />
</Button>
