PRAGMA foreign_keys = OFF;

--> statement-breakpoint
CREATE TABLE `screenshots_queue_new` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`width` integer NOT NULL,
	`height` integer NOT NULL,
	`url` text NOT NULL,
	`lang` text,
	`article_id` integer NOT NULL,
	`queued_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`processing_attempts` integer DEFAULT 0 NOT NULL,
	`processing_last_started_at` integer,
	`processing_last_errored_at` integer,
	FOREIGN KEY (`article_id`) REFERENCES `articles`(`id`) ON UPDATE cascade ON DELETE cascade
);


--> statement-breakpoint
INSERT INTO
  screenshots_queue_new
SELECT
  *
FROM
  screenshots_queue;

--> statement-breakpoint
DROP TABLE screenshots_queue;

--> statement-breakpoint
ALTER TABLE
  screenshots_queue_new RENAME TO screenshots_queue;

--> statement-breakpoint
PRAGMA foreign_keys = ON;