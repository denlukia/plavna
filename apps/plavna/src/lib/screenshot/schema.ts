import { createScreenshotsQueueSchema, supportedLangs } from '@plavna/common';

import { table_images } from '../image/schema';

export const table_screenshotsQueue = createScreenshotsQueueSchema(supportedLangs, table_images);
