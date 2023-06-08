DROP INDEX IF EXISTS `idx_unique_user_slug`;--> statement-breakpoint
CREATE UNIQUE INDEX `idx_userpage_unique_user_slug` ON `page` (`user_id`,`slug`);