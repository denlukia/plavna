CREATE TABLE `new_preview_types` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`name_translation_id` integer NOT NULL,
	`image_id` integer,
	`url` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `auth_user`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`name_translation_id`) REFERENCES `translations`(`key`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`image_id`) REFERENCES `images`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO new_preview_types SELECT * FROM preview_types;
--> statement-breakpoint
DROP TABLE preview_types;
--> statement-breakpoint
ALTER TABLE new_preview_types RENAME TO preview_types;
