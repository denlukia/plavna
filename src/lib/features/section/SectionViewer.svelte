<script lang="ts">
	import Typography from '$lib/design-system/components/Typography.svelte';

	import Translation from '../i18n/Translation.svelte';
	import type { SectionProp } from './types';

	type Props = {
		section: SectionProp;
	};

	let { section }: Props = $props();
</script>

<Translation recordKey={section.meta.title_translation_key} markdown />
