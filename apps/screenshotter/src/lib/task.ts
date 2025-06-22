import { and, asc, eq, isNull, lt, or, sql } from 'drizzle-orm';
import { ATTEMPT_REPROCESSING_AFTER_MS, MAX_PROCESSING_ATTEMPTS } from '$lib/constants';
import { db } from '$lib/db';
import { screenshotsQueue } from '$lib/db-schema';

export async function assignYourselfTask() {
	// Atomically find and assign a task to this process in a single UPDATE statement
	const minusNSeconds = new Date().getTime() - ATTEMPT_REPROCESSING_AFTER_MS;

	const nextTask = db.$with('next_task').as(
		db
			.select({ id: screenshotsQueue.id })
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
			.limit(1)
	);

	const results = await db
		.with(nextTask)
		.update(screenshotsQueue)
		.set({
			processing_started_at: sql`(strftime('%s', 'now'))`,
			processing_attempts: sql`${screenshotsQueue.processing_attempts} + 1`
		})
		.where(eq(screenshotsQueue.id, sql`(select id from ${nextTask})`))
		.returning();

	return results[0] || null;
}

export function clearTask(task: typeof screenshotsQueue.$inferSelect) {
	return db.delete(screenshotsQueue).where(eq(screenshotsQueue.id, task.id)).run();
}
