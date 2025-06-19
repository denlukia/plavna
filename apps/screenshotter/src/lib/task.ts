import { and, asc, eq, isNull, lt, or, sql } from 'drizzle-orm';
import { MAX_PROCESSING_ATTEMPTS } from '$lib/constants';
import { db } from '$lib/db';
import { screenshotsQueue } from '$lib/db-schema';

export function getTask() {
	const minusTenSeconds = new Date().getTime() - 10000;
	return db
		.select()
		.from(screenshotsQueue)
		.where(
			and(
				or(
					isNull(screenshotsQueue.processing_started_at),
					lt(screenshotsQueue.processing_started_at, minusTenSeconds)
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
