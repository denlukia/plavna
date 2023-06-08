<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { defaultLang } from '$lib/common/languages';
	import { generatePath } from '$lib/common/url';
	import T from '$lib/components/T.svelte';
	import TranslationEditor from '$lib/components/TranslationEditor.svelte';
	import type { PageData } from './$types';
	import type { ActionData } from './$types.js';

	export let data: PageData;
	export let form: ActionData;

	// function onSlugChange(e: Event) {
	// 	const target = e.target as HTMLInputElement;
	// 	if (!target.value) return;
	// 	const { lang, username } = $page.params;
	// 	const newUrl = generatePath('/[lang]/[username]/[slug]/edit', {
	// 		'[lang]': lang || '',
	// 		'[username]': username,
	// 		'[slug]': target.value
	// 	});
	// 	history.replaceState(null, '', newUrl);
	// }
</script>

<!-- TODO Handle slug changes to url changes (with utils function) -->
<h1>Post id: {data.post?.id}</h1>
<form method="POST" use:enhance>
	<input type="hidden" name="id" value={data?.post?.id ?? null} />
	<div><input type="text" name="slug" value={data?.post?.slug ?? null} placeholder="Slug" /></div>
	<div>
		<TranslationEditor
			prefix="title_translation"
			id={data?.post?.title_translation_id}
			initial={data?.post?.title_translation}
		/>
	</div>
	<div>
		<button formaction="?/update">Зберегти</button>
		<button formaction="?/publish">Опубликувати</button>
	</div>
	{#if form?.save.errorKey}
		<T key={form?.save.errorKey} />
	{/if}
</form>
