DROP INDEX IF EXISTS "idx_articles_unique_user_slug";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_pages_unique_user_slug";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_sections_page_id";--> statement-breakpoint
DROP INDEX IF EXISTS "auth_user_github_id_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "auth_user_username_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_user_unique_username";--> statement-breakpoint
ALTER TABLE `articles` ALTER COLUMN "preview_prop_1" TO "preview_prop_1" text DEFAULT '';--> statement-breakpoint
CREATE UNIQUE INDEX `idx_articles_unique_user_slug` ON `articles` (`slug`,`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_pages_unique_user_slug` ON `pages` (`user_id`,`slug`);--> statement-breakpoint
CREATE INDEX `idx_sections_page_id` ON `sections` (`page_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `auth_user_github_id_unique` ON `auth_user` (`github_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `auth_user_username_unique` ON `auth_user` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_user_unique_username` ON `auth_user` (`username`);--> statement-breakpoint
ALTER TABLE `articles` ALTER COLUMN "preview_prop_2" TO "preview_prop_2" text DEFAULT '';--> statement-breakpoint
ALTER TABLE `articles` ADD `preview_prop_3` text DEFAULT '';--> statement-breakpoint
ALTER TABLE `articles` ADD `preview_prop_4` text DEFAULT '';