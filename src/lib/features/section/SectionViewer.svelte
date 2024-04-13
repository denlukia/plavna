<script lang="ts">
	import Translation from '../i18n/Translation.svelte';
	import type { SectionSelect } from './parsers';

	export let section: SectionSelect;
</script>

<Translation recordKey={section.title_translation_key} />
