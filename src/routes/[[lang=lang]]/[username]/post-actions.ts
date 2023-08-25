import { type RequestEvent, fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';

import { generatePath } from '$lib/isomorphic/url';
import { update_translation } from '$lib/server/common-actions';
import {
	postPreviewUpdateSchema,
	postSlugUpdateSchema,
	tagDeleteSchema,
	tagUpdateSchema,
	translationInsertSchema
} from '$lib/server/domain/parsers';

import type { RouteParams as RouteParams1 } from './[slug]/edit/$types';
import type { RouteParams as RouteParams2 } from './page-[pagename]/[slug]/edit/$types';

async function switch_tag(event: ActionRequestEvt) {
	const form = await superValidate(event.request, tagUpdateSchema);
	if (!form.valid) return fail(400, { form });

	const { slug } = event.params;
	const { plavna } = event.locals;
	await plavna.tags.switchChecked(form.data, slug);
}

async function create_tag(event: ActionRequestEvt) {
	const form = await superValidate(event.request, translationInsertSchema);
	if (!form.valid) return fail(400, { form });

	const { plavna } = event.locals;
	await plavna.tags.create(form.data);
}

async function delete_tag(event: ActionRequestEvt) {
	const form = await superValidate(event.request, tagDeleteSchema);
	if (!form.valid) return fail(400, { form });

	const { plavna } = event.locals;
	await plavna.tags.delete(form.data);
}

async function update_slug(event: ActionRequestEvt) {
	const { slug } = event.params;
	const form = await superValidate(event.request, postSlugUpdateSchema);
	if (!form.valid) return fail(400, { form });

	const { plavna } = event.locals;
	const result = await plavna.posts.updateSlug(slug, form.data);

	let replacementsObject: Record<string, string | undefined> = {
		'[[lang=lang]]': event.params.lang,
		'[username]': event.params.username,
		'[slug]': result.slug
	};
	if ('pagename' in event.params) {
		replacementsObject['[pagename]'] = event.params.pagename;
	}
	throw redirect(302, generatePath(event.route.id, replacementsObject));
}

async function edit_post(event: ActionRequestEvt, type: 'publish' | 'hide' | 'delete') {
	const { slug } = event.params;
	const { plavna } = event.locals;
	await plavna.posts[type](slug);

	if (type === 'delete') {
		let destinationRouteId = '/[[lang=lang]]/[username]';
		let replacementsObject: Record<string, string | undefined> = {
			'[[lang=lang]]': event.params.lang,
			'[username]': event.params.username
		};
		if ('pagename' in event.params) {
			destinationRouteId = '/[[lang=lang]]/[username]/page-[pagename]';
			replacementsObject['[pagename]'] = event.params.pagename;
		}
		throw redirect(302, generatePath(destinationRouteId, replacementsObject));
	}
}

async function update_preview(event: ActionRequestEvt) {
	const { slug } = event.params;
	const form = await superValidate(event.request, postPreviewUpdateSchema);
	if (!form.valid) return fail(400, { form });

	const { plavna } = event.locals;
	await plavna.posts.updatePreview(slug, form.data);
}

type ActionRequestEvt =
	| RequestEvent<RouteParams1, '/[[lang=lang]]/[username]/[slug]/edit'>
	| RequestEvent<RouteParams2, '/[[lang=lang]]/[username]/page-[pagename]/[slug]/edit'>;

export const actions = {
	update_translation,
	switch_tag,
	create_tag,
	delete_tag,
	update_slug,
	publish: (event: ActionRequestEvt) => edit_post(event, 'publish'),
	hide: (event: ActionRequestEvt) => edit_post(event, 'hide'),
	delete: (event: ActionRequestEvt) => edit_post(event, 'delete'),
	update_preview
};
