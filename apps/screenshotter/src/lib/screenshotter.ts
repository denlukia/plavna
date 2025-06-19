import type { ElementScreenshotOptions, Page } from 'puppeteer-core';

import { wait } from './utils';

export async function getScreenshot(page: Page, url: string, width: number, height: number) {
	await page.setViewport({
		width: width || 640,
		height: height || 480,
		deviceScaleFactor: 2
	});

	await page.goto(url);

	const previewRoot = await page.$('.preview-root');
	await wait(2000);

	const screenshotConfig: ElementScreenshotOptions = { omitBackground: true, encoding: 'binary' };
	const uint8Array = previewRoot
		? await previewRoot.screenshot(screenshotConfig)
		: await page.screenshot(screenshotConfig);

	const file = new File([uint8Array], 'screenshot.png', { type: 'image/png' });

	await page.close();

	return file;
}
