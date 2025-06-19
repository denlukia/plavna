import type { ElementHandle, ElementScreenshotOptions, Page } from 'puppeteer-core';

export async function getScreenshot(element: Page | ElementHandle<Element>) {
	const screenshotConfig: ElementScreenshotOptions = { omitBackground: true, encoding: 'binary' };
	const uint8Array = await element.screenshot(screenshotConfig);

	const file = new File([uint8Array], 'screenshot.png', { type: 'image/png' });

	return file;
}
