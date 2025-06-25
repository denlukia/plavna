/**
 * Style of the emoji.
 */
export type Style =
	| 'facebook'
	| 'messenger'
	| 'whatsapp'
	| 'twitter'
	| 'joypixels'
	| 'openmoji'
	| 'emojidex'
	| 'lg'
	| 'htc'
	| 'mozilla'
	| 'apple'
	| 'google'
	| 'microsoft'
	| 'samsung';

/**
 * Cache for loaded emoji images and pending requests
 */
const emojiImageCache = new Map<string, HTMLImageElement>();
const pendingRequests = new Map<string, Promise<HTMLImageElement>>();

/**
 * Browser-compatible image loading function with caching and request deduplication
 */
const loadImage = (url: string): Promise<HTMLImageElement> => {
	// Check if image is already cached
	if (emojiImageCache.has(url)) {
		return Promise.resolve(emojiImageCache.get(url)!);
	}

	// Check if there's already a pending request for this URL
	if (pendingRequests.has(url)) {
		return pendingRequests.get(url)!;
	}

	// Create new request
	const promise = new Promise<HTMLImageElement>((resolve, reject) => {
		const img = new Image();
		img.crossOrigin = 'anonymous'; // Enable CORS for external images

		img.onload = () => {
			// Cache the loaded image
			emojiImageCache.set(url, img);
			// Remove from pending requests
			pendingRequests.delete(url);
			resolve(img);
		};

		img.onerror = () => {
			// Remove from pending requests on error
			pendingRequests.delete(url);
			reject(new Error(`Failed to load image: ${url}`));
		};

		img.src = url;
	});

	// Store the pending request
	pendingRequests.set(url, promise);

	return promise;
};

/**
 * Cache for segment processing results (for width calculations and positioning)
 */
const segmentCache = new Map<string, { width: number; isEmoji: boolean }>();

/**
 * Get cached segment info or calculate it
 */
const getSegmentInfo = async (
	segment: string,
	context: CanvasRenderingContext2D,
	style: Style,
	fontSize: number,
	padding: number
): Promise<{ width: number; isEmoji: boolean; image?: HTMLImageElement }> => {
	const cacheKey = `${segment}-${style}-${fontSize}`;

	if (segment.length === 1) {
		// Regular character
		if (!segmentCache.has(cacheKey)) {
			const width = context.measureText(segment).width;
			segmentCache.set(cacheKey, { width, isEmoji: false });
		}
		return { ...segmentCache.get(cacheKey)!, image: undefined };
	}

	// Emoji segment
	const url = encodeURI(`https://emojicdn.elk.sh/${segment}?style=${style}`);

	try {
		const img = await loadImage(url);
		const width = fontSize + padding * 2;

		// Cache the width info (but not the image, that's cached separately)
		if (!segmentCache.has(cacheKey)) {
			segmentCache.set(cacheKey, { width, isEmoji: true });
		}

		return { width, isEmoji: true, image: img };
	} catch (e) {
		console.warn(`Failed to load emoji image: ${url}`);
		// Fallback to text measurement
		const width = context.measureText(segment).width;
		if (!segmentCache.has(cacheKey)) {
			segmentCache.set(cacheKey, { width, isEmoji: false });
		}
		return { width, isEmoji: false, image: undefined };
	}
};

/**
 * @param {CanvasRenderingContext2D} context - The context of the canvas you're drawing on.
 * @param {string} text - The text to fill.
 * @param {number} x - x coordinate of the text.
 * @param {number} y - y coordinate of the text.
 * @param {Style} style - The style of the emoji.
 */
export const fillText = async (
	context: CanvasRenderingContext2D,
	text: string,
	x: number,
	y: number,
	style: Style = 'apple'
): Promise<void> => {
	const segments = splitter(text);
	const match = /\d+/.exec(context.font);
	const fontSize = match !== null ? parseInt(match[0]) : 0;
	const padding = fontSize * 0.15;

	// Process all segments and get their info (this will trigger parallel loading)
	const segmentInfoPromises = segments.map((segment) =>
		getSegmentInfo(segment, context, style, fontSize, padding)
	);

	// Wait for all segments to be processed
	const segmentInfos = await Promise.all(segmentInfoPromises);

	// Now draw everything
	let width = 0;

	for (let i = 0; i < segments.length; i++) {
		const segment = segments[i];
		const info = segmentInfos[i];

		if (!info.isEmoji) {
			// Regular character
			context.fillText(segment, x + width, y);
			width += info.width;
		} else if (info.image) {
			// Emoji with successfully loaded image
			const scale = fontSize * 1.1;
			context.drawImage(info.image, x + width + padding, y - scale * 0.9, scale, scale);
			width += info.width;
		} else {
			// Emoji that failed to load, fallback to text
			context.fillText(segment, x + width, y);
			width += context.measureText(segment).width;
		}
	}
};

/**
 * It takes a string and returns an array of strings
 * @param {string} text - string - the text to be segmented
 * @returns An array of strings.
 */
export const splitter = (text: string): string[] => {
	const segmenter = new Intl.Segmenter().segment(text);
	const array = Array.from(segmenter).map((s) => s.segment);
	return array;
};

// Updated createEmojiCanvas function using the browser-compatible functions
export async function createEmojiCanvas(
	emoji: string,
	size: number,
	cols: number,
	rows: number,
	emojiProvider: Style = 'apple'
): Promise<{ dataUrl: string; logicalSize: { width: number; height: number } }> {
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	if (!ctx) throw new Error('Could not get canvas context');

	const dpr = 1.5;

	// Set logical canvas size
	const logicalWidth = size * cols * 1.5;
	const logicalHeight = size * rows * 1.3;

	// Set actual canvas size for retina
	canvas.width = logicalWidth * dpr;
	canvas.height = logicalHeight * dpr;

	// Set CSS size to maintain logical dimensions
	canvas.style.width = `${logicalWidth}px`;
	canvas.style.height = `${logicalHeight}px`;

	// Scale the context to match device pixel ratio
	ctx.scale(dpr, dpr);

	// Set up font with scaled size
	ctx.font = `${size}px Arial, sans-serif`;
	ctx.textBaseline = 'bottom';
	ctx.textAlign = 'left';

	// Split emoji into segments
	const pattern1 = splitter(emoji).filter((e) => e !== ' ');
	const [first, ...other] = pattern1;
	const pattern2 = other.concat(first);

	// Create alternating lines - start from bottom
	for (let row = 0; row < rows; row++) {
		const pattern = row % 2 === 1 ? pattern1 : pattern2;
		const y = logicalHeight - (rows - 1 - row) * size * 1.3 - 10;

		for (let col = 0; col < cols; col++) {
			const emojiChar = pattern[col % pattern.length];
			const x = col * size * 1.5;

			// Then draw the fill
			await fillText(ctx, emojiChar, x, y, emojiProvider);
		}
	}

	return {
		dataUrl: canvas.toDataURL(),
		logicalSize: { width: logicalWidth, height: logicalHeight }
	};
}
