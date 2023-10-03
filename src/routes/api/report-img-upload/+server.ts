import { SCREENSHOTTER_ACCESS_TOKEN } from '$env/static/private';
import { HttpError_1, error, json, text } from '@sveltejs/kit';

import type { RequestHandler } from './$types';
import type { ScreenshotReport, ScreenshotReportRequest } from 'plavna-common';

export const POST: RequestHandler = async ({ request, locals }) => {
	const body: ScreenshotReportRequest = await request.json();

	if (body.accessToken !== SCREENSHOTTER_ACCESS_TOKEN) {
		throw error(403, 'Invalid access token');
	}

	const { plavna } = locals;
	try {
		await plavna.articles.processPreviewScreenshotReport(body.report);
		return text('OK');
	} catch (e) {
		console.error(e);
		if (e !== null && typeof e === 'object' && 'status' in e) {
			throw e;
		} else {
			throw error(500, 'Internal server error');
		}
	}
};
