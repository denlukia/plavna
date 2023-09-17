<script lang="ts">
	import { page } from '$app/stores';
	import type { ImageSelect } from '$lib/server/collections/types';

	export let image: ImageSelect;

	function getSrc(endpoint: string | null | undefined, path: string | null) {
		if (!endpoint || !path) return null;
		return endpoint + path;
	}
</script>

<img src={getSrc($page.data.user?.imagekit_url_endpoint, image.path)} alt="" />
