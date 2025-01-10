import type { Browser } from 'puppeteer-core';

export async function getPage(browser: Browser) {
	return browser.newPage();
}
