<script lang="ts">
	import { page } from '$app/stores';
	import type { ImageSelect, TranslationSelect } from '$lib/server/collections/types';

	export let image: ImageSelect;

	$: ({ translations, user } = $page.data);

	function getSrc(
		endpoint: string | null | undefined,
		path_translation_key: TranslationSelect['key'] | null,
		path: string | null
	) {
		if (!endpoint) return null;
		if (path_translation_key && translations[path_translation_key]) {
			const translation = translations[path_translation_key];
			return `${endpoint}/${translation}`;
		} else if (path) {
			return `${endpoint}/${path}`;
		} else {
			return null;
		}
	}
</script>

<img src={getSrc(user?.imagekit_url_endpoint, image.path_translation_key, image.path)} alt="" />

<style>
	img {
		display: block;
	}
</style>
