import { and, asc, eq, isNull, lt, or, sql } from 'drizzle-orm';
import { MAX_PROCESSING_ATTEMPTS, TIMEOUT_FOR_PROCESSING_BEFORE_REPORT } from '$lib/constants';
import { db } from '$lib/db';
import { screenshotsQueue } from '$lib/db-schema';

export function getTask() {
	// We only process tasks that have not been processed at all or seemingly timed out (aka their processing_started_at is older than TIMEOUT_FOR_PROCESSING_BEFORE_REPORT ms)
	const minusNSeconds = new Date().getTime() - TIMEOUT_FOR_PROCESSING_BEFORE_REPORT;
	return db
		.select()
		.from(screenshotsQueue)
		.where(
			and(
				or(
					isNull(screenshotsQueue.processing_started_at),
					lt(screenshotsQueue.processing_started_at, minusNSeconds)
				),
				lt(screenshotsQueue.processing_attempts, MAX_PROCESSING_ATTEMPTS)
			)
		)
		.orderBy(asc(screenshotsQueue.queued_at))
		.get();
}

export function setTaskInProcessing(task: typeof screenshotsQueue.$inferSelect) {
	return db
		.update(screenshotsQueue)
		.set({
			processing_started_at: sql`(strftime('%s', 'now'))`,
			processing_attempts: sql`${screenshotsQueue.processing_attempts} + 1`
		})
		.where(eq(screenshotsQueue.id, task.id))
		.run();
}

export function clearTask(task: typeof screenshotsQueue.$inferSelect) {
	return db.delete(screenshotsQueue).where(eq(screenshotsQueue.id, task.id)).run();
}
