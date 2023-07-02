CREATE TABLE `image` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text,
	`type` text NOT NULL,
	`reference` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `auth_user`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `auth_key` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`primary_key` integer NOT NULL,
	`hashed_password` text,
	`expires` integer,
	FOREIGN KEY (`user_id`) REFERENCES `auth_user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `page` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`slug` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `auth_user`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `post` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`slug` text NOT NULL,
	`title_translation_id` integer NOT NULL,
	`content_translation_id` integer NOT NULL,
	`published_at` integer,
	`static_preview_id` integer,
	`dynamic_preview_id` integer,
	`dynamic_preview_show_on` text,
	FOREIGN KEY (`user_id`) REFERENCES `auth_user`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`title_translation_id`) REFERENCES `translation`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`content_translation_id`) REFERENCES `translation`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`static_preview_id`) REFERENCES `preview_type`(`id`) ON UPDATE set null ON DELETE set null,
	FOREIGN KEY (`dynamic_preview_id`) REFERENCES `preview_type`(`id`) ON UPDATE set null ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `preview_type` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text,
	`name` integer NOT NULL,
	`info_image` integer,
	`code_reference` text NOT NULL,
	`prop_1_name` text,
	`prop_2_name` text,
	`prop_3_name` text,
	`prop_1_translation_id` integer,
	`prop_2_translation_id` integer,
	`prop_3_translation_id` integer,
	FOREIGN KEY (`user_id`) REFERENCES `auth_user`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`name`) REFERENCES `translation`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`info_image`) REFERENCES `image`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`prop_1_translation_id`) REFERENCES `translation`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`prop_2_translation_id`) REFERENCES `translation`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`prop_3_translation_id`) REFERENCES `translation`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `section` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`page_id` integer NOT NULL,
	`user_id` text NOT NULL,
	`title_translation_id` integer NOT NULL,
	FOREIGN KEY (`page_id`) REFERENCES `page`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `auth_user`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`title_translation_id`) REFERENCES `translation`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `section_tag` (
	`section_id` integer NOT NULL,
	`tag_id` integer NOT NULL,
	PRIMARY KEY(`section_id`, `tag_id`),
	FOREIGN KEY (`section_id`) REFERENCES `section`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`tag_id`) REFERENCES `tag`(`id`) ON UPDATE cascade ON DELETE cascade
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
CREATE TABLE `tag` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`name_translation_id` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `auth_user`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`name_translation_id`) REFERENCES `translation`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `tag_post` (
	`tag_id` integer NOT NULL,
	`post_id` integer NOT NULL,
	PRIMARY KEY(`post_id`, `tag_id`),
	FOREIGN KEY (`tag_id`) REFERENCES `tag`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`post_id`) REFERENCES `post`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `translation` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`en` text,
	`uk` text,
	FOREIGN KEY (`user_id`) REFERENCES `auth_user`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `auth_user` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`uploadcare_token` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_userpage_unique_user_slug` ON `page` (`user_id`,`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_post_unique_user_slug` ON `post` (`slug`,`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_user_unique_username` ON `auth_user` (`username`);