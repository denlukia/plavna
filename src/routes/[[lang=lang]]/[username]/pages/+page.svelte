<script lang="ts">
	import { enhance } from '$app/forms';
	import T from '$lib/components/T.svelte';
	import type { ActionData } from './$types.js';

	export let data;
	export let form: ActionData;
</script>

{#each data.pages as page}
	<div>
		<a href="./{page.slug || ''}">{page.slug || 'default'}</a>
		<form method="POST" action="?/delete" use:enhance>
			<input name="slug" type="hidden" value={page.slug} /><button><T key="delete_page" /></button>
		</form>
		{#if form?.deletion?.errorKey && form?.deletion?.slug === page.slug}
			<T key={form?.deletion?.errorKey} />
		{/if}
	</div>
{/each}

<form method="POST" use:enhance action="?/create">
	<input name="slug" hidden={!data.pages.length} value={form?.creation?.slug ?? ''} />
	<button>Create new page</button>
</form>
{#if form?.creation?.errorKey}<T key={form?.creation?.errorKey} />{/if}
