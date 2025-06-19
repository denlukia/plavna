import type { Browser, Page } from 'puppeteer-core';

import { wait } from './utils';

export async function getPage(browser: Browser) {
	return browser.newPage();
}

export async function loadPage(page: Page, url: string, width: number, height: number) {
	await page.setViewport({
		width: width || 640,
		height: height || 480,
		deviceScaleFactor: 2
	});

	await page.goto(url);

	await wait(1000);

	const previewRoot = await page.$('.preview-root');

	return previewRoot || page;
}

export async function closePage(page: Page) {
	await page.close();
}
