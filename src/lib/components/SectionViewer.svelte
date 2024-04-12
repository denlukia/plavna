<script lang="ts">
	import type { SectionSelect } from '$lib/(features)/page/section/parsers';

	import Translation from './Translation.svelte';

	export let section: SectionSelect;
</script>

<Translation key={section.title_translation_key} />
