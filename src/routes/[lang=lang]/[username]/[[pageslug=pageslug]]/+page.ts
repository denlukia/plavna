import type { PreviewFamilyId } from '$lib/features/preview/families/types';
import { getPreviewComponent } from '$lib/features/preview/get-component';

import type { PageLoad } from './$types';

// TODO: Investigate error here
export const load: PageLoad = async ({ data }) => {
	const { previewFamilies, ...other } = structuredClone(data);

	for (const previewFamily in previewFamilies) {
		const previewFamilyTyped = previewFamily as PreviewFamilyId;

		const component = await getPreviewComponent(previewFamily, 'Static');
		if (component instanceof Error) continue;

		previewFamilies[previewFamilyTyped].components = {
			...previewFamilies[previewFamilyTyped].components,
			Static: component
		};
	}

	return { ...other, previewFamilies };
};
