import { redirect } from '@sveltejs/kit';
import { customAlphabet } from 'nanoid';

import type { PageServerLoad } from './$types';

export const load = (async () => {
	const generateId = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz');
	const draftId = generateId(4);
	return redirect(303, `./draft-${draftId}/edit`);
}) satisfies PageServerLoad;
