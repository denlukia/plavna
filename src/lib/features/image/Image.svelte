<script lang="ts">
	import type { SupportedLang } from '@denlukia/plavna-common/types';
	import { page } from '$app/stores';

	import type { TranslationSelect } from '../i18n/parsers';
	import type { ImageSelect } from './parsers';

	export let image: ImageSelect;
	export let lang: SupportedLang | null = null;

	$: ({ translations, user } = $page.data);

	function getSrc(
		endpoint: string | null | undefined,
		path_translation_key: TranslationSelect['key'] | null,
		path: string | null
	) {
		if (!endpoint) return null;
		if (lang && path_translation_key && translations[path_translation_key]) {
			let translationRecord = translations[path_translation_key];
			let pathTranslation;
			if (typeof translationRecord === 'object' && lang in translationRecord) {
				pathTranslation = translationRecord[lang];
			} else {
				return null;
			}
			return `${endpoint}${pathTranslation}`;
		} else if (!lang && path) {
			return `${endpoint}${path}`;
		} else {
			return null;
		}
	}
</script>

<img src={getSrc(user?.imagekit_url_endpoint, image.path_translation_key, image.path)} alt="" />

<style>
	img {
		/* display: block; */
		width: 20px;
	}
</style>
