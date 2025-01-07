import { and, asc, eq, lt, sql } from 'drizzle-orm';

import { MAX_PROCESSING_ATTEMPTS } from '$lib/constants';
import { db } from '$lib/db';
import { screenshotsQueue } from '$lib/db-schema';

export function getTask() {
	return db
		.select()
		.from(screenshotsQueue)
		.where(
			and(
				eq(screenshotsQueue.processing_running, false),
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
			processing_running: true
		})
		.where(eq(screenshotsQueue.id, task.id))
		.run();
}

export function setTaskProcessingFailed(task: typeof screenshotsQueue.$inferSelect) {
	return db
		.update(screenshotsQueue)
		.set({
			processing_running: false,
			processing_attempts: sql`${screenshotsQueue.processing_attempts} + 1`
		})
		.where(eq(screenshotsQueue.id, task.id))
		.run();
}

export function clearTask(task: typeof screenshotsQueue.$inferSelect) {
	return db.delete(screenshotsQueue).where(eq(screenshotsQueue.id, task.id)).run();
}
