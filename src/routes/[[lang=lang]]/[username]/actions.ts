import { type RequestEvent, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';

import { generatePath } from '$lib/isomorphic/url';
import { update_translation } from '$lib/server/actions';
import {
	postUpdateSchema,
	tagDeleteSchema,
	tagUpdateSchema,
	translationInsertSchema
} from '$lib/server/schemas/zod';

import type { RouteParams as RouteParams1 } from './[slug]/edit/$types';
import type { RouteParams as RouteParams2 } from './page-[pagename]/[slug]/edit/$types';

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

async function edit_post(event: ActionRequestEvt, subtype: 'save' | 'publish' | 'hide' | 'delete') {
	const form = await superValidate(event.request, postUpdateSchema);

	const { plavna } = event.locals;

	const result = await plavna.posts[subtype](form.data);

	let replacementsObject: Record<string, string | undefined> = {
		'[[lang=lang]]': event.params.lang,
		'[username]': event.params.username
	};

	let urlBase = '/[[lang=lang]]/[username]/';

	if ('slug' in result) {
		urlBase = event.route.id;
		replacementsObject['[slug]'] = result.slug;
	}
	if ('pagename' in event.params) {
		replacementsObject['[pagename]'] = event.params.pagename;
	}
	throw redirect(302, generatePath(urlBase, replacementsObject));
}

type ActionRequestEvt =
	| RequestEvent<RouteParams1, '/[[lang=lang]]/[username]/[slug]/edit'>
	| RequestEvent<RouteParams2, '/[[lang=lang]]/[username]/page-[pagename]/[slug]/edit'>;

export const actions = {
	update_translation,
	switch_tag,
	create_tag,
	delete_tag,
	save: (event: ActionRequestEvt) => edit_post(event, 'save'),
	publish: (event: ActionRequestEvt) => edit_post(event, 'publish'),
	hide: (event: ActionRequestEvt) => edit_post(event, 'hide'),
	delete: (event: ActionRequestEvt) => edit_post(event, 'delete')
};
