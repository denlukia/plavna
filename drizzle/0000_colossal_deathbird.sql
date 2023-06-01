CREATE TABLE `auth_key` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`primary_key` integer NOT NULL,
	`hashed_password` text,
	`expires` integer,
	FOREIGN KEY (`user_id`) REFERENCES `auth_user`(`id`)
);
--> statement-breakpoint
CREATE TABLE `auth_session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`active_expires` integer NOT NULL,
	`idle_expires` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `auth_user`(`id`)
);
--> statement-breakpoint
CREATE TABLE `auth_user` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `page` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`slug` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `auth_user`(`id`)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_unique_user_slug` ON `page` (`user_id`,`slug`);