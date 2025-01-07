/* eslint-disable consistent-return */

import { readUInt16BE } from '../common';
import { str2arr } from '../common';
import { sliceEq } from '../common';
import * as exif from '../exif_utils';

var SIG_EXIF = str2arr('Exif\0\0');

export default function (data) {
	if (data.length < 2) return;

	// first marker of the file MUST be 0xFFD8,
	// following by either 0xFFE0, 0xFFE2 or 0xFFE3
	if (data[0] !== 0xff || data[1] !== 0xd8 || data[2] !== 0xff) return;

	var offset = 2;

	for (;;) {
		// skip until we see 0xFF, see https://github.com/nodeca/probe-image-size/issues/68
		for (;;) {
			if (data.length - offset < 2) return;
			if (data[offset++] === 0xff) break;
		}

		var code = data[offset++];
		var length;

		// skip padding bytes
		while (code === 0xff) code = data[offset++];

		// standalone markers, according to JPEG 1992,
		// http://www.w3.org/Graphics/JPEG/itu-t81.pdf, see Table B.1
		if ((0xd0 <= code && code <= 0xd9) || code === 0x01) {
			length = 0;
		} else if (0xc0 <= code && code <= 0xfe) {
			// the rest of the unreserved markers
			if (data.length - offset < 2) return;

			length = readUInt16BE(data, offset) - 2;
			offset += 2;
		} else {
			// unknown markers
			return;
		}

		if (code === 0xd9 /* EOI */ || code === 0xda /* SOS */) {
			// end of the datastream
			return;
		}

		var orientation;

		// try to get orientation from Exif segment
		if (code === 0xe1 && length >= 10 && sliceEq(data, offset, SIG_EXIF)) {
			orientation = exif.get_orientation(data.slice(offset + 6, offset + length));
		}

		if (
			length >= 5 &&
			0xc0 <= code &&
			code <= 0xcf &&
			code !== 0xc4 &&
			code !== 0xc8 &&
			code !== 0xcc
		) {
			if (data.length - offset < length) return;

			var result = {
				width: readUInt16BE(data, offset + 3),
				height: readUInt16BE(data, offset + 1),
				type: 'jpg',
				mime: 'image/jpeg',
				wUnits: 'px',
				hUnits: 'px'
			};

			if (orientation > 0) {
				result.orientation = orientation;
			}

			return result;
		}

		offset += length;
	}
}
