import { supportedLangs } from '@plavna/image-uploader/constants';
import { createScreenshotsQueueSchema } from '@plavna/image-uploader/queue';

import { table_images } from '../image/schema';

export const table_screenshotsQueue = createScreenshotsQueueSchema(supportedLangs, table_images);
