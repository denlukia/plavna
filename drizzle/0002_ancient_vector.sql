DROP INDEX IF EXISTS `idx_unique_user_slug`;--> statement-breakpoint
CREATE UNIQUE INDEX `idx_post_unique_user_slug` ON `post` (`slug`,`user_id`);