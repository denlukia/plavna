import type { ElementScreenshotOptions, Page } from 'puppeteer-core';

export async function getScreenshot(page: Page, url: string, width: number, height: number) {
	await page.setViewport({
		width: width || 640,
		height: height || 480,
		deviceScaleFactor: 2
	});

	await page.goto(url);

	const previewRoot = await page.$('.preview-root');
	const screenshotConfig: ElementScreenshotOptions = { omitBackground: true, encoding: 'binary' };
	const buffer = previewRoot
		? await previewRoot.screenshot(screenshotConfig)
		: await page.screenshot(screenshotConfig);

	const file = new File([buffer], 'screenshot.png', { type: 'image/png' });

	await page.close();

	return file;
}
