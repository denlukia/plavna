import * as parsers from './lib/parsers_sync';

type Probe = {
	type: string;
	mime: string;
	width: number;
	height: number;
	wUnits: string;
	hUnits: string;
};

export function getImageTypeAndSize(buffer: ArrayBuffer): null | Probe {
	const typedArray = new Uint8Array(buffer);

	const parser_names = Object.keys(parsers);

	for (let i = 0; i < parser_names.length; i++) {
		const result = parsers[parser_names[i]](typedArray);
		if (result) return result;
	}

	return null;
}
