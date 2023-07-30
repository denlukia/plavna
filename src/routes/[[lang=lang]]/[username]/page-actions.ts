import { type RequestEvent, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';

import { translationInsertSchema } from '$lib/server/domain/zod';

import type { RouteParams as RouteParams1 } from './$types';
import type { RouteParams as RouteParams2 } from './page-[pagename]/$types';

type ActionRequestEvt =
	| RequestEvent<RouteParams1, '/[[lang=lang]]/[username]'>
	| RequestEvent<RouteParams2, '/[[lang=lang]]/[username]/page-[pagename]'>;

export const actions = {
	create_section: async (event: ActionRequestEvt) => {
		const form = await superValidate(event.request, translationInsertSchema);
		if (!form.valid) return fail(400, { form });

		const { plavna } = event.locals;
		const { username } = event.params;
		let pagename = '';
		if ('pagename' in event.params) {
			pagename = event.params.pagename;
		}
		await plavna.sections.create(username, pagename, form.data);
	}
};
