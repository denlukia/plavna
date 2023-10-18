PRAGMA foreign_keys = OFF;

--> statement-breakpoint
CREATE TABLE "screenshots_queue_new" (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `image_id` integer NOT NULL,
  `width` integer NOT NULL,
  `height` integer NOT NULL,
  `url` text NOT NULL,
  `lang` text,
  `queued_at` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
  `processing_attempts` integer DEFAULT 0 NOT NULL,
  `image_provider_data` blob NOT NULL,
  `processing_running` integer DEFAULT false NOT NULL,
  FOREIGN KEY (`image_id`) REFERENCES `images`(`id`) ON UPDATE cascade ON DELETE cascade
);

--> statement-breakpoint
DROP TABLE screenshots_queue;

--> statement-breakpoint
ALTER TABLE
  screenshots_queue_new RENAME TO screenshots_queue;

--> statement-breakpoint
PRAGMA foreign_keys = ON;