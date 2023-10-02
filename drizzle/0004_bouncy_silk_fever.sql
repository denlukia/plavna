CREATE TABLE `screenshots_queue` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`width` integer NOT NULL,
	`height` integer NOT NULL,
	`url` text NOT NULL,
	`lang` text,
	`article_id` integer NOT NULL,
	`queued_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`processing_attempts` integer DEFAULT 0 NOT NULL,
	`processing_last_started_at` integer,
	`processing_last_errored_at` integer,
	FOREIGN KEY (`article_id`) REFERENCES `articles`(`id`) ON UPDATE cascade ON DELETE cascade
);
