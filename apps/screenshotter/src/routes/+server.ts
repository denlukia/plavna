import { error, text } from '@sveltejs/kit';
import { REPLACE_PREVIEW_URL_IN, REPLACE_PREVIEW_URL_OUT } from '$env/static/private';
import { getBrowser } from '$lib/browser';
import { BROWSER_MAX_OPENING_MS } from '$lib/constants';
import { getPage } from '$lib/page';
import { reportScreenshotUpload } from '$lib/reporter';
import { createRunner } from '$lib/runner';
import { getScreenshot } from '$lib/screenshotter';
import { clearTask, getTask, setTaskInProcessing, setTaskProcessingFailed } from '$lib/task';
import { uploadScreenshot } from '$lib/uploader';
import { validateRequest } from '$lib/validator';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	await validateRequest(request);

	const { run, timer } = createRunner();

	// 1. Run browser and measure if it's cached
	const start = performance.now();
	const browser = await getBrowser();
	const end = performance.now();
	const executionTime = end - start;
	console.log(`getBrowser executed in ${executionTime} ms`);

	// 2. If browser loaded fast then we run everything else
	if (executionTime < BROWSER_MAX_OPENING_MS) {
		const task = await run(getTask);
		if (task) {
			try {
				await run(setTaskInProcessing, task);
				const page = await run(getPage, browser);

				if (REPLACE_PREVIEW_URL_IN && REPLACE_PREVIEW_URL_OUT) {
					task.url = task.url.replace(REPLACE_PREVIEW_URL_IN, REPLACE_PREVIEW_URL_OUT);
				}

				const screenshot = await run(getScreenshot, page, task.url, task.width, task.height);
				const imageProcessed = await run(uploadScreenshot, task, screenshot);
				const reportResponse = await run(reportScreenshotUpload, imageProcessed);
				if (reportResponse.ok) {
					await run(clearTask, task);
				} else {
					throw new Error('Reporting error');
				}
			} catch (e: unknown) {
				console.error(e);
				await setTaskProcessingFailed(task);
				error(500, String(e));
			}
		}
	}

	clearTimeout(timer);
	return text('OK');
};
