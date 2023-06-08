CREATE TABLE `post` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`slug` text NOT NULL,
	`title_translation` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `auth_user`(`id`),
	FOREIGN KEY (`title_translation`) REFERENCES `translation`(`id`)
);
--> statement-breakpoint
CREATE TABLE `section` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`page_id` integer NOT NULL,
	`user_id` text NOT NULL,
	`title_translation` integer NOT NULL,
	FOREIGN KEY (`page_id`) REFERENCES `page`(`id`),
	FOREIGN KEY (`user_id`) REFERENCES `auth_user`(`id`),
	FOREIGN KEY (`title_translation`) REFERENCES `translation`(`id`)
);
--> statement-breakpoint
CREATE TABLE `section_tag` (
	`section_id` integer NOT NULL,
	`tag_id` integer NOT NULL,
	PRIMARY KEY(`section_id`, `tag_id`),
	FOREIGN KEY (`section_id`) REFERENCES `section`(`id`),
	FOREIGN KEY (`tag_id`) REFERENCES `tag`(`id`)
);
--> statement-breakpoint
CREATE TABLE `tag` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name_translation` integer NOT NULL,
	FOREIGN KEY (`name_translation`) REFERENCES `translation`(`id`)
);
--> statement-breakpoint
CREATE TABLE `tag_post` (
	`tag_id` integer NOT NULL,
	`post_id` integer NOT NULL,
	PRIMARY KEY(`tag_id`, `post_id`),
	FOREIGN KEY (`tag_id`) REFERENCES `tag`(`id`),
	FOREIGN KEY (`post_id`) REFERENCES `post`(`id`)
);
--> statement-breakpoint
CREATE TABLE `translation` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`en` text,
	`uk` text
);