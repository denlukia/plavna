import { type RequestEvent, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';

import {
	sectionDeleteSchema,
	sectionUpdateSchema,
	translationInsertSchema
} from '$lib/server/domain/zod';

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

		let pagename = '';
		if ('pagename' in event.params) {
			pagename = event.params.pagename;
		}
		await plavna.sections.create(pagename, form.data);
	},
	update_section: async (event: ActionRequestEvt) => {
		const form = await superValidate(event.request, sectionUpdateSchema);
		if (!form.valid) return fail(400, { form });

		const { plavna } = event.locals;

		await plavna.sections.update(form.data);
	},
	delete_section: async (event: ActionRequestEvt) => {
		const form = await superValidate(event.request, sectionDeleteSchema);
		if (!form.valid) return fail(400, { form });

		const { plavna } = event.locals;
		await plavna.sections.delete(form.data);
	}
};
