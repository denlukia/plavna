import { env } from '$env/dynamic/private';
import type { Browser, Page } from 'puppeteer-core';

import { wait } from './utils';

export async function createPage(browser: Browser) {
	return browser.newPage();
}

export async function loadUrlOnPage(page: Page, url: string, width: number, height: number) {
	// Replace preview URL if configured
	if (env.REPLACE_PREVIEW_URL_IN && env.REPLACE_PREVIEW_URL_OUT) {
		url = url.replace(env.REPLACE_PREVIEW_URL_IN, env.REPLACE_PREVIEW_URL_OUT);
	}

	await page.setViewport({
		width: width || 640,
		height: height || 480,
		deviceScaleFactor: 2
	});

	await page.goto(url);

	await wait(1250);

	const previewRoot = await page.$('.preview-root');

	return previewRoot || page;
}

export async function closePage(page: Page) {
	await page.close();
}
