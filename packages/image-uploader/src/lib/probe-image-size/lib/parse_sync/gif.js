/* eslint-disable consistent-return */

import { str2arr } from '../common';
import { sliceEq } from '../common';
import { readUInt16LE } from '../common';

var SIG_GIF87a = str2arr('GIF87a');
var SIG_GIF89a = str2arr('GIF89a');

export default function (data) {
	if (data.length < 10) return;

	if (!sliceEq(data, 0, SIG_GIF87a) && !sliceEq(data, 0, SIG_GIF89a)) return;

	return {
		width: readUInt16LE(data, 6),
		height: readUInt16LE(data, 8),
		type: 'gif',
		mime: 'image/gif',
		wUnits: 'px',
		hUnits: 'px'
	};
}
