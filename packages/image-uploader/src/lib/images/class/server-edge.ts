import { ImageHandler } from './base';

// imagekit-javascript in base class uses XHR for upload
// but Vercel Edge doesn't have it, so we try to polyfill it
import '../xhr-polyfill';

// TODO: get-pixels doesn't work in Vercel Edge,
// so we can look at executing color probe separately in Serverless function
// and use Sharp for that (to support more formats)
export class ServerImageHandlerVercelEdge extends ImageHandler {
	protected async prepareForColorProbe() {
		return null;
	}
}
