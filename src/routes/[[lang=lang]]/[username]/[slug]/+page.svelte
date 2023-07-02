<script lang="ts">
	import Post from '../Post.svelte';

	import type { PageData } from './$types';

	export let data: PageData;
</script>

<Post {data} />
