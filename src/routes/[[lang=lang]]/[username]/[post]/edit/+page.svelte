<script lang="ts">
	import { enhance } from '$app/forms';

	import T from '$lib/components/T.svelte';
	import TranslationEditor from '$lib/components/TranslationEditor.svelte';

	import type { PageData } from './$types';
	import type { ActionData } from './$types.js';

	export let data: PageData;
	export let form: ActionData;
</script>

<h1>Post id: {data.post?.id}</h1>
<h2>Published: {data.post?.published_at}</h2>
<form
	method="POST"
	use:enhance={() => {
		return async ({ update }) => {
			await update({ reset: false });
		};
	}}
>
	<input type="hidden" name="id" value={data.post?.id ?? null} />
	<div><input type="text" name="slug" value={data.post?.slug ?? null} placeholder="Slug" /></div>
	<div>
		<TranslationEditor prefix="title_translation" initial={data?.post?.title_translation} />
	</div>
	<div>
		<button formaction="?/save">Зберегти</button>
		<button formaction="?/{data.post?.published_at ? 'hide' : 'publish'}"
			>{data.post?.published_at ? 'Сховати' : 'Опублікувати'}</button
		>
	</div>
	{#if form?.save.errorKey}
		<T key={form?.save.errorKey} />
	{/if}
</form>
