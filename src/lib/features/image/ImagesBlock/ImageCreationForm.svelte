<script lang="ts">
	import type { superValidate, SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import type { ArticleSelect } from '$lib/features/article/parsers';

	import type { ImageCreationForm } from '../parsers';

	type Props = {
		articleId: ArticleSelect['id'] | null;
		isAccountCommon: boolean;
		superValidated: SuperValidated<ImageCreationForm>;
	};

	let { articleId, isAccountCommon, superValidated }: Props = $props();

	let { enhance } = $derived(superForm(superValidated));
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
