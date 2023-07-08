import type { PageLoad } from './$types';

export const load = (async ({ data }) => {
	const previewComponent = (await import('$lib/components/previews/PlavnaEditor.svelte')).default;
	return { ...data, previewComponent };
}) satisfies PageLoad;
