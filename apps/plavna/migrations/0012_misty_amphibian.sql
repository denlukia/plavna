DROP INDEX "idx_articles_unique_user_slug";--> statement-breakpoint
DROP INDEX "idx_pages_unique_user_slug";--> statement-breakpoint
DROP INDEX "idx_sections_page_id";--> statement-breakpoint
DROP INDEX "auth_user_github_id_unique";--> statement-breakpoint
DROP INDEX "auth_user_username_unique";--> statement-breakpoint
DROP INDEX "idx_user_unique_username";--> statement-breakpoint
ALTER TABLE `pages` ALTER COLUMN "typography_aesthetic_theme" TO "typography_aesthetic_theme" text NOT NULL DEFAULT 'inter-markdown';--> statement-breakpoint
CREATE UNIQUE INDEX `idx_articles_unique_user_slug` ON `articles` (`slug`,`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_pages_unique_user_slug` ON `pages` (`user_id`,`slug`);--> statement-breakpoint
CREATE INDEX `idx_sections_page_id` ON `sections` (`page_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `auth_user_github_id_unique` ON `auth_user` (`github_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `auth_user_username_unique` ON `auth_user` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_user_unique_username` ON `auth_user` (`username`);--> statement-breakpoint
ALTER TABLE `articles` DROP COLUMN `preview_create_localized_screenshots`;