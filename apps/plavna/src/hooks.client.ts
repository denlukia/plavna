// hooks.client.js
import { init } from '@jill64/sentry-sveltekit-edge/client';

const onError = init(
	'https://378a9658ae1cc68c845e4b8be36dfee0@o4509407519965184.ingest.de.sentry.io/4509407521603664',
	{ sentryOptions: { tracesSampleRate: 1 } }
);

export const handleError = onError();
