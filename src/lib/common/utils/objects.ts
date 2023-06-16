export function nestify(arg: any): any {
	if (typeof arg !== 'object') {
		return arg;
	}

	const result: any = {};

	for (const key in arg) {
		if (arg.hasOwnProperty(key)) {
			const value = arg[key];
			const nestedKeys = key.split('.');
			let nestedObj = result;

			for (let i = 0; i < nestedKeys.length; i++) {
				const nestedKey = nestedKeys[i];

				if (!nestedObj.hasOwnProperty(nestedKey)) {
					nestedObj[nestedKey] = {};
				}

				if (i === nestedKeys.length - 1) {
					nestedObj[nestedKey] = value;
				} else {
					nestedObj = nestedObj[nestedKey];
				}
			}
		}
	}

	return result;
}
