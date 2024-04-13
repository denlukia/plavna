import { supportedLangs } from '@denlukia/plavna-common/constants';
import { createScreenshotsQueueSchema } from '@denlukia/plavna-common/queue';

import { images } from '../image/schemas';

export const screenshotsQueue = createScreenshotsQueueSchema(supportedLangs, images);
