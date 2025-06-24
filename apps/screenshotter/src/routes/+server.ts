import { text } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { getBrowser } from '$lib/browser';
import { MAX_TASKS_PER_CALL } from '$lib/constants';
import { closePage, createPage, loadUrlOnPage } from '$lib/page';
import { reportScreenshotUpload } from '$lib/reporter';
import { getScreenshot } from '$lib/screenshotter';
import { assignYourselfNTasks, clearTask } from '$lib/task';
import { uploadScreenshot } from '$lib/uploader';
import { validateRequest } from '$lib/validator';

import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	await validateRequest(request);

	const browser = await getBrowser();
	let processedTasks = 0;
	const tasks = await assignYourselfNTasks(MAX_TASKS_PER_CALL);

	// Process up to MAX_TASKS_PER_CALL tasks
	for (const task of tasks) {
		let page;
		try {
			// Create a fresh page for each task to avoid conflicts
			page = await createPage(browser);

			// Replace preview URL if configured
			if (env.REPLACE_PREVIEW_URL_IN && env.REPLACE_PREVIEW_URL_OUT) {
				task.url = task.url.replace(env.REPLACE_PREVIEW_URL_IN, env.REPLACE_PREVIEW_URL_OUT);
				console.log(task.url);
			}

			const element = await loadUrlOnPage(page, task.url, task.width, task.height);
			const screenshot = await getScreenshot(element);
			const imageProcessed = await uploadScreenshot(task, screenshot);
			const reportResponse = await reportScreenshotUpload(imageProcessed);

			if (reportResponse.ok) {
				await clearTask(task);
			} else {
				throw new Error('Reporting error');
			}

			processedTasks++;
		} catch (e: unknown) {
			console.error(`Error processing task ${task.id}:`, String(e));
			// Continue to next task instead of breaking the entire process
		} finally {
			// Always close the page for this task
			if (page) {
				await closePage(page);
			}
		}
	}

	return text(`Processed ${processedTasks} tasks`);
};
