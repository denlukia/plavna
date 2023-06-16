<script lang="ts">
	import T from '$lib/components/T.svelte';

	import type { PageData } from './$types';

	export let data: PageData;
</script>

<h1>Post id: {data.post?.id}</h1>
<h2>Published: {data.post?.published_at}</h2>
<p>{data.post?.slug}</p>
<div>
	<T translation={data?.post?.title_translation} />
</div>
