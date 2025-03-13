import type { ImagePathAndMeta } from '@plavna/design/components';

// ISO 639-1
export const supportedLangs = ['en', 'uk'] as const;

export const ARTISTIC_OVERFLOW = 16;

type Optional<T> = T | null | undefined;

export type PreviewDataProp = {
	title_translation: Optional<string>;
	description_translation: Optional<string>;
	likes_count: number;
	prop_1: string | null;
	prop_2: string | null;
	prop_3: string | null;
	prop_4: string | null;
	cols: number;
	rows: number;
	publish_time: Date | null;
	viewing_in_article: boolean;
	translation_1: Optional<string>;
	translation_2: Optional<string>;
	tags: Array<Optional<string>>;
	img_1: Optional<ImagePathAndMeta>;
	img_2: Optional<ImagePathAndMeta>;
	screenshot?: Optional<ImagePathAndMeta>;
	screenshot_in_article?: Optional<ImagePathAndMeta>;
	lang: Optional<string>;
	url: Optional<string>;
	width?: Optional<number>;
	height?: Optional<number>;
	pointer?: { x: number; y: number } | null;
};

export function serializePreviewParams(baseUrl: string | undefined, params: PreviewDataProp) {
	if (!baseUrl) {
		return '';
	}

	// Remove any existing query parameters from the URL
	const url = baseUrl.split('?')[0];

	// Build query string
	const queryParts: string[] = [];

	// Helper function to handle nested objects and arrays
	function processParam(key: string, value: any, prefix: string = ''): void {
		const finalKey = prefix ? `${prefix}[${key}]` : key;

		if (value === null || value === undefined) {
			// Skip null or undefined values
			return;
		} else if (Array.isArray(value)) {
			// Handle arrays
			value.forEach((item, index) => {
				processParam(index.toString(), item, finalKey);
			});
		} else if (typeof value === 'object' && !(value instanceof Date)) {
			// Handle nested objects
			Object.entries(value).forEach(([nestedKey, nestedValue]) => {
				processParam(nestedKey, nestedValue, finalKey);
			});
		} else {
			// Handle primitive values and dates
			let stringValue: string;

			if (value instanceof Date) {
				stringValue = value.toISOString();
			} else if (typeof value === 'boolean') {
				stringValue = value ? 'true' : 'false';
			} else {
				stringValue = value.toString();
			}

			queryParts.push(`${encodeURIComponent(finalKey)}=${encodeURIComponent(stringValue)}`);
		}
	}

	// Process all parameters
	Object.entries(params).forEach(([key, value]) => {
		processParam(key, value);
	});

	// Combine URL and query string
	if (queryParts.length === 0) {
		return url;
	}

	return `${url}?${queryParts.join('&')}`;
}

export function deserializePreviewParams(url: string): PreviewDataProp {
	const result: Record<string, any> = {};

	// Extract the query string from the URL
	const queryString = url.split('?')[1];

	if (!queryString) {
		return result as PreviewDataProp;
	}

	// Split the query string into individual key-value pairs
	const pairs = queryString.split('&');

	pairs.forEach((pair) => {
		const [key, value] = pair.split('=').map(decodeURIComponent);

		// Handle nested parameters (key format: parent[child][grandchild])
		const keyParts = key.match(/([^\[\]]+)|\[([^\[\]]*)\]/g);

		if (!keyParts) {
			return;
		}

		// Remove any empty strings and clean up the keys
		const cleanKeys = keyParts.map((part) => part.replace(/[\[\]]/g, '')).filter(Boolean);

		// Start with the root object
		let current = result;

		// Navigate through the nested structure
		for (let i = 0; i < cleanKeys.length - 1; i++) {
			const currentKey = cleanKeys[i];

			// If next key is a number, prepare an array
			const nextKey = cleanKeys[i + 1];
			const isNextKeyNumeric = /^\d+$/.test(nextKey);

			// Initialize the property if it doesn't exist
			if (!(currentKey in current)) {
				current[currentKey] = isNextKeyNumeric ? [] : {};
			}

			current = current[currentKey];
		}

		// Get the last key, which will receive the value
		const lastKey = cleanKeys[cleanKeys.length - 1];

		// Parse the value based on its content
		let parsedValue: any = value;

		// Try to parse boolean values
		if (value === 'true') {
			parsedValue = true;
		} else if (value === 'false') {
			parsedValue = false;
		} else if (value === 'null') {
			parsedValue = null;
		} else if (!isNaN(Number(value)) && value !== '') {
			// Try to parse numeric values, but avoid empty strings
			parsedValue = Number(value);
		} else if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value)) {
			// Try to parse ISO date strings
			parsedValue = new Date(value);
		}

		// Assign the value to the last key
		current[lastKey] = parsedValue;
	});

	return result as PreviewDataProp;
}

export function mapRange(
	x: number,
	in_min: number,
	in_max: number,
	out_min: number,
	out_max: number
) {
	return ((x - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
}
