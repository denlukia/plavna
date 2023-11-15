<script lang="ts">
	import type { ArticleSelect, ImageCreationFormZod } from '$lib/server/collections/types';
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms/client';

	export let articleId: ArticleSelect['id'] | null = null;
	export let isAccountCommon = false;
	export let form: SuperValidated<ImageCreationFormZod>;

	$: ({ enhance } = superForm(form));
</script>

<form method="POST" action="?/create_image" use:enhance>
	{#if isAccountCommon}
		<input type="hidden" name="is_account_common" value={isAccountCommon} />
	{/if}
	{#if articleId}
		<input type="hidden" name="article_id" value={articleId} />
	{/if}
	<button>Create</button>
</form>
