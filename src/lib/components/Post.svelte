<script lang="ts">
	import T from '$lib/components/Translation.svelte';

	import type { PageData } from '../../routes/[[lang=lang]]/[username]/[slug]/$types';

	export let data: PageData;
</script>

{JSON.stringify(data, null, 2)}
<h1>
	<T key={data.post.title_translation_id} />
</h1>
<T key={data.post.content_translation_id} markdownMode />
<svelte:component this={data.previewComponent} />
