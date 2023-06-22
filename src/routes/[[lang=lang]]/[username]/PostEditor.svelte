<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	import TranslationEditor from '$lib/components/TranslationEditor.svelte';

	import type { PageData } from './[post]/edit/$types';

	export let data: PageData;

	const { form, errors, enhance } = superForm(data.form);
</script>

<h1>Post id: {$form.id}</h1>
<h2>Published: {$form.published_at}</h2>
<form method="POST" use:enhance>
	<input type="hidden" name="id" value={$form.id ?? null} />
	<div><input type="text" name="slug" value={$form.slug ?? null} placeholder="Slug" /></div>
	<div>
		<TranslationEditor prefix="title_translation" form={$form} />
	</div>
	<div>
		<button formaction="?/save">Зберегти</button>
		<button formaction="?/{$form.published_at ? 'hide' : 'publish'}"
			>{$form.published_at ? 'Сховати' : 'Опублікувати'}</button
		>
	</div>
	{#if $errors._errors}
		{#each $errors._errors as error}
			<p>{error}</p>
		{/each}
	{/if}
</form>
