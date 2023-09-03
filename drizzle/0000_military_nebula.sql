CREATE TABLE `articles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`slug` text NOT NULL,
	`title_translation_id` integer NOT NULL,
	`content_translation_id` integer NOT NULL,
	`published_at` integer,
	`preview_type_id` integer,
	`preview_interactions_show_on` text,
	`preview_prop_1_value` text,
	`preview_prop_2_value` text,
	`preview_prop_3_value` text,
	FOREIGN KEY (`user_id`) REFERENCES `auth_user`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`title_translation_id`) REFERENCES `translations`(`key`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`content_translation_id`) REFERENCES `translations`(`key`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`preview_type_id`) REFERENCES `preview_types`(`id`) ON UPDATE set null ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `images` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text,
	`source` text NOT NULL,
	`reference` text NOT NULL,
	`reference_translation_id` integer,
	FOREIGN KEY (`user_id`) REFERENCES `auth_user`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`reference_translation_id`) REFERENCES `translations`(`key`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `auth_key` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`hashed_password` text,
	FOREIGN KEY (`user_id`) REFERENCES `auth_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `pages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`slug` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `auth_user`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `preview_types` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text,
	`name_translation_id` integer NOT NULL,
	`image_id` integer,
	`url` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `auth_user`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`name_translation_id`) REFERENCES `translations`(`key`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`image_id`) REFERENCES `images`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `sections` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`page_id` integer NOT NULL,
	`user_id` text NOT NULL,
	`title_translation_id` integer NOT NULL,
	FOREIGN KEY (`page_id`) REFERENCES `pages`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `auth_user`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`title_translation_id`) REFERENCES `translations`(`key`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `sections_to_tags` (
	`section_id` integer NOT NULL,
	`tag_id` integer NOT NULL,
	`lang` text NOT NULL,
	PRIMARY KEY(`lang`, `section_id`, `tag_id`),
	FOREIGN KEY (`section_id`) REFERENCES `sections`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `auth_session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`active_expires` integer NOT NULL,
	`idle_expires` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `auth_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`name_translation_id` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `auth_user`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`name_translation_id`) REFERENCES `translations`(`key`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `tags_to_articles` (
	`tag_id` integer NOT NULL,
	`article_id` integer NOT NULL,
	PRIMARY KEY(`article_id`, `tag_id`),
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`article_id`) REFERENCES `articles`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `translations` (
	`key` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text,
	`en` text,
	`uk` text,
	FOREIGN KEY (`user_id`) REFERENCES `auth_user`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `auth_user` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`imagekit_public_key` text,
	`imagekit_private_key` text,
	`imagekit_url_endpoint` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_articles_unique_user_slug` ON `articles` (`slug`,`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_pages_unique_user_slug` ON `pages` (`user_id`,`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_user_unique_username` ON `auth_user` (`username`);