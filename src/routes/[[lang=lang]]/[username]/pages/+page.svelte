<script lang="ts">
	import { enhance } from '$app/forms';
	import T from '$lib/components/T.svelte';
	import type { ActionData } from './$types.js';

	export let data;
	export let form: ActionData;
</script>

{#each data.pages as page}
	<fieldset>
		<a href="./{page.slug || ''}">{page.slug || 'default'}</a>
		<form method="POST" action="?/edit" use:enhance>
			<input name="id" type="hidden" value={page.id} />
			<input name="slug" value={form?.edit?.slug ?? page.slug} />
			<button><T key="edit_slug" /></button>
			{#if form?.edit?.errorKey && form?.edit?.id === page.id}
				<T key={form?.edit?.errorKey} />
			{/if}
		</form>
		<form method="POST" action="?/delete" use:enhance>
			<input name="id" type="hidden" value={page.id} />
			<button><T key="delete_page" /></button>
			{#if form?.deletion?.errorKey && form?.deletion?.id === page.id}
				<T key={form?.deletion?.errorKey} />
			{/if}
		</form>
	</fieldset>
{/each}

<form method="POST" use:enhance action="?/create">
	<input name="slug" hidden={!data.pages.length} value={form?.creation?.slug ?? ''} />
	<button><T key="create_new_page" /></button>
</form>
{#if form?.creation?.errorKey}<T key={form?.creation?.errorKey} />{/if}
