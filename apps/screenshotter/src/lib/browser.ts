import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import chromium from '@sparticuz/chromium-min';
import puppeteer, { type Browser } from 'puppeteer-core';

let browser: Browser | null = null;

export async function getBrowser() {
	if (browser) {
		return browser;
	}

	browser = await puppeteer.launch({
		defaultViewport: chromium.defaultViewport,
		ignoreHTTPSErrors: true,

		args: dev ? puppeteer.defaultArgs() : chromium.args,
		executablePath: dev
			? env.LOCAL_RELATIVE_CHROMIUM_PATH
			: await chromium.executablePath(env.GITHUB_CHROMIUM_EXECUTABLE_PATH),
		headless: dev ? false : chromium.headless
	});

	return browser;
}
