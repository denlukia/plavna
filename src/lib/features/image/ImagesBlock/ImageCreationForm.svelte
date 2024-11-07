<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import { superForm } from 'sveltekit-superforms';
	import Button from '$lib/design/components/Button/Button.svelte';
	import type { ArticleSelect } from '$lib/features/article/parsers';
	import Translation from '$lib/features/i18n/Translation.svelte';

	import type { ImageCreationForm } from '../parsers';

	type Props = {
		articleId: ArticleSelect['id'] | null;
		superValidated: SuperValidated<ImageCreationForm>;
	};

	let { articleId, superValidated }: Props = $props();

	let { enhance } = superForm(superValidated);
</script>

<form method="POST" action="?/create_image" use:enhance>
	{#if articleId}
		<input type="hidden" name="article_id" value={articleId} />
	{/if}

	<Button>
		<Translation key="article_editor.images.new" />
	</Button>
</form>
