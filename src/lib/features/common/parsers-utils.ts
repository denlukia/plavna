import { supportedLangs } from '@denlukia/plavna-common/constants';
import type { SupportedLang } from '@denlukia/plavna-common/types';

function createSuffixedField<N extends string, S extends string, V>(
	name: N,
	suffix: S,
	validator: V
) {
	const key = `${name}.${suffix}` as `${N}.${S}`;
	return { [key]: validator } as Record<typeof key, typeof validator>;
}
export function generateLanguagedFields<N extends string, V>(name: N, validator: V) {
	return supportedLangs.reduce(
		(acc, lang) => ({ ...acc, ...createSuffixedField(name, lang, validator) }),
		{} as ReturnType<typeof createSuffixedField<typeof name, SupportedLang, V>>
	);
}
