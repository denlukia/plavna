import { redirect } from '@sveltejs/kit';
import { customAlphabet } from 'nanoid';

import type { PageServerLoad } from './$types';

export const load = (async ({ locals: { articleService } }) => {
	const generateId = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz');
	const draftId = generateId(4);
	const slug = `draft-${draftId}`;
	await articleService.createFromSlug(slug);
	return redirect(303, `./${slug}/edit`);
}) satisfies PageServerLoad;
