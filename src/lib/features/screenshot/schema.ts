import { supportedLangs } from '@denlukia/plavna-common/constants';
import { createScreenshotsQueueSchema } from '@denlukia/plavna-common/queue';

import { table_images } from '../image/schema';

export const table_screenshotsQueue = createScreenshotsQueueSchema(supportedLangs, table_images);
