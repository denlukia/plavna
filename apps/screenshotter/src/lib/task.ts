import { and, asc, eq, inArray, isNull, lt, or, sql } from 'drizzle-orm';
import { ATTEMPT_REPROCESSING_AFTER_MS, MAX_PROCESSING_ATTEMPTS } from '$lib/constants';
import { db } from '$lib/db';
import { screenshotsQueue } from '$lib/db-schema';

export async function assignYourselfNTasks(n: number) {
	// Atomically find and assign a task to this process in a single UPDATE statement
	const minusNSeconds = new Date().getTime() - ATTEMPT_REPROCESSING_AFTER_MS;

	const nextTasks = db.$with('next_task').as(
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
			.limit(n)
	);

	const results = await db
		.with(nextTasks)
		.update(screenshotsQueue)
		.set({
			processing_started_at: sql`(strftime('%s', 'now'))`,
			processing_attempts: sql`${screenshotsQueue.processing_attempts} + 1`
		})
		.where(inArray(screenshotsQueue.id, sql`(select id from ${nextTasks})`))
		.returning();

	return results;
}

export function clearTask(task: typeof screenshotsQueue.$inferSelect) {
	return db.delete(screenshotsQueue).where(eq(screenshotsQueue.id, task.id)).run();
}
