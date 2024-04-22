<script lang="ts">
	import Translation from '../i18n/Translation.svelte';
	import type { SectionProp } from './types';

	type Props = {
		section: SectionProp;
	};

	let { section }: Props = $props();
</script>

<div class="section-viewer">
	<Translation recordKey={section.meta.title_translation_key} markdown />
</div>

<style>
	.section-viewer {
		min-height: 20px;
	}
</style>
