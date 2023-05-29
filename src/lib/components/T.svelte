<script lang="ts">
	import { page } from '$app/stores';
	import type { PossibleTransKey } from '$lib/server/i18n/system-translations/en';

	export let key: PossibleTransKey;
</script>

{$page.data.translations[key]}
