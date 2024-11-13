PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_sections_to_tags` (
	`section_id` integer NOT NULL,
	`tag_id` integer NOT NULL,
	`lang` text NOT NULL,
	PRIMARY KEY(`section_id`, `tag_id`, `lang`),
	FOREIGN KEY (`section_id`) REFERENCES `sections`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_sections_to_tags`("section_id", "tag_id", "lang") SELECT "section_id", "tag_id", "lang" FROM `sections_to_tags`;--> statement-breakpoint
DROP TABLE `sections_to_tags`;--> statement-breakpoint
ALTER TABLE `__new_sections_to_tags` RENAME TO `sections_to_tags`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_tags_to_articles` (
	`tag_id` integer NOT NULL,
	`article_id` integer NOT NULL,
	PRIMARY KEY(`tag_id`, `article_id`),
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE cascade ON DELETE cascade,
	FOREIGN KEY (`article_id`) REFERENCES `articles`(`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_tags_to_articles`("tag_id", "article_id") SELECT "tag_id", "article_id" FROM `tags_to_articles`;--> statement-breakpoint
DROP TABLE `tags_to_articles`;--> statement-breakpoint
ALTER TABLE `__new_tags_to_articles` RENAME TO `tags_to_articles`;