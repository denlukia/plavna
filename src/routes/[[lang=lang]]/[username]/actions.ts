import { superValidate } from 'sveltekit-superforms/server';

import { update_translation } from '$lib/server/actions';
import {
	postUpdateSchema,
	tagDeleteSchema,
	tagUpdateSchema,
	translationInsertSchema
} from '$lib/server/schemas/zod';

import type { RouteParams } from './[slug]/edit/$types';
import type { RequestEvent } from '@sveltejs/kit';

async function switch_tag(event: ActionRequestEvt) {
	const { slug } = event.params;
	const form = await superValidate(event.request, tagUpdateSchema);

	const { plavna } = event.locals;
	await plavna.tags.switchChecked(form.data, slug);
}

async function create_tag(event: ActionRequestEvt) {
	const form = await superValidate(event.request, translationInsertSchema);

	const { plavna } = event.locals;
	await plavna.tags.create(form.data);
}

async function delete_tag(event: ActionRequestEvt) {
	const form = await superValidate(event.request, tagDeleteSchema);

	const { plavna } = event.locals;
	await plavna.tags.delete(form.data);
}

async function edit_post(event: ActionRequestEvt, subtype: 'save' | 'publish' | 'hide') {
	const form = await superValidate(event.request, postUpdateSchema);

	const { plavna } = event.locals;
	await plavna.posts[subtype](form.data);
}

type ActionRequestEvt = RequestEvent<RouteParams, '/[[lang=lang]]/[username]/[slug]/edit'>;
export const actions = {
	update_translation,
	switch_tag,
	create_tag,
	delete_tag,
	save: (event: ActionRequestEvt) => edit_post(event, 'save'),
	publish: (event: ActionRequestEvt) => edit_post(event, 'publish'),
	hide: (event: ActionRequestEvt) => edit_post(event, 'hide')
};
