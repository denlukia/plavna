<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import type { ArticleSelect } from '$lib/features/article/parsers';

	import type { ImageCreationForm } from '../parsers';

	export let articleId: ArticleSelect['id'] | null = null;
	export let isAccountCommon = false;
	export let form: SuperValidated<ImageCreationForm>;

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
