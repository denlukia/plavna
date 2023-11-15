<script lang="ts">
	import type { ArticleSelect } from '$lib/server/collections/types';

	export let articleId: ArticleSelect['id'] | null = null;
</script>

<form method="POST" action="?/create_image">
	{#if articleId}
		<input type="hidden" name="article_id" value={articleId} />
	{/if}
	<button>Create</button>
</form>
