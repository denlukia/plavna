<script lang="ts">
	import type { SectionSelect } from '$lib/server/domain/types';
	import Translation from './Translation.svelte';

	export let section: SectionSelect;
</script>

<Translation key={section.title_translation_id} />
