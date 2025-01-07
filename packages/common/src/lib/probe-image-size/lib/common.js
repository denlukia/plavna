const sliceEq = function (src, start, dest) {
	for (var i = start, j = 0; j < dest.length; ) {
		if (src[i++] !== dest[j++]) return false;
	}
	return true;
};

const str2arr = function (str, format) {
	var arr = [],
		i = 0;

	if (format && format === 'hex') {
		while (i < str.length) {
			arr.push(parseInt(str.slice(i, i + 2), 16));
			i += 2;
		}
	} else {
		for (; i < str.length; i++) {
			/* eslint-disable no-bitwise */
			arr.push(str.charCodeAt(i) & 0xff);
		}
	}

	return arr;
};

const readUInt16LE = function (data, offset) {
	return data[offset] | (data[offset + 1] << 8);
};

const readUInt16BE = function (data, offset) {
	return data[offset + 1] | (data[offset] << 8);
};

const readUInt32LE = function (data, offset) {
	return (
		data[offset] |
		(data[offset + 1] << 8) |
		(data[offset + 2] << 16) |
		(data[offset + 3] * 0x1000000)
	);
};

const readUInt32BE = function (data, offset) {
	return (
		data[offset + 3] |
		(data[offset + 2] << 8) |
		(data[offset + 1] << 16) |
		(data[offset] * 0x1000000)
	);
};

function ProbeError(message, code, statusCode) {
	Error.call(this);

	// Include stack trace in error object
	if (Error.captureStackTrace) {
		// Chrome and NodeJS
		Error.captureStackTrace(this, this.constructor);
	} else {
		// FF, IE 10+ and Safari 6+. Fallback for others
		this.stack = new Error().stack || '';
	}

	this.name = this.constructor.name;

	this.message = message;
	if (code) this.code = code;
	if (statusCode) this.statusCode = statusCode;
}

// Inherit from Error
ProbeError.prototype = Object.create(Error.prototype);
ProbeError.prototype.constructor = ProbeError;

export { sliceEq, str2arr, readUInt16LE, readUInt16BE, readUInt32LE, readUInt32BE, ProbeError };
