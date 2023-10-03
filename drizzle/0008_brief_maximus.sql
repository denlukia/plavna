ALTER TABLE screenshots_queue ADD `processing_running` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `screenshots_queue` DROP COLUMN `processing_last_started_at`;--> statement-breakpoint
ALTER TABLE `screenshots_queue` DROP COLUMN `processing_last_errored_at`;