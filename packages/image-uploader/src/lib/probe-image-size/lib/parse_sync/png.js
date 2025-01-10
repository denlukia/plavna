/* eslint-disable consistent-return */

import { str2arr } from '../common';
import { sliceEq } from '../common';
import { readUInt32BE } from '../common';

var SIG_PNG = str2arr('\x89PNG\r\n\x1a\n');
var SIG_IHDR = str2arr('IHDR');

export default function (data) {
	if (data.length < 24) return;

	// check PNG signature
	if (!sliceEq(data, 0, SIG_PNG)) return;

	// check that first chunk is IHDR
	if (!sliceEq(data, 12, SIG_IHDR)) return;

	return {
		width: readUInt32BE(data, 16),
		height: readUInt32BE(data, 20),
		type: 'png',
		mime: 'image/png',
		wUnits: 'px',
		hUnits: 'px'
	};
}
