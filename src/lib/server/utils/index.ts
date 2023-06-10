import { error, redirect } from '@sveltejs/kit';

import type { SupportedLang } from '$lib/common/languages';

export type TranslationsFromForm = {
	[key in SupportedLang]: string;
} & {
	_id: number | null;
};

export function getTranslationsFromForm(
	formData: FormData,
	searchPrefix: string
): TranslationsFromForm {
	const formObj = Object.fromEntries(formData.entries());
	const objEntries = Object.entries(formObj);
	const onlyPrefixedEntries = objEntries.filter(([key]) => {
		if (key.split('.')[0] === searchPrefix) return true;
	});
	const prefixRemovedEntries = onlyPrefixedEntries.map(([key, value]) => {
		const newKey = key.split('.').slice(1).join('.');
		let newValue;
		if (newKey === '_id') {
			newValue = value !== null ? Number(value) : value;
		} else {
			newValue = value;
		}
		return [newKey, newValue];
	});

	return Object.fromEntries(prefixRemovedEntries);
}

export async function getUserOrThrow(locals: App.Locals, params: any) {
	const { user } = await locals.auth.validateUser();
	if (!user) throw redirect(302, '/plavna/login');
	if (user.username !== params.username) throw error(403);
	return user;
}
