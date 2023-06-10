<script lang="ts">
	import { page } from '$app/stores';

	import type { TranslationKey } from '$lib/server/i18n/system-translations/en';

	export let key: TranslationKey;
</script>

{$page.data.translations[key]}
