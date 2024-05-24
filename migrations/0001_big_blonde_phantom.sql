ALTER TABLE
  articles RENAME COLUMN preview_interactions_show_on TO preview_interactions_show_on_old;

--> statement-breakpoint
ALTER TABLE
  articles
ADD
  COLUMN preview_interactions_show_on TEXT DEFAULT 'hover' NOT NULL;

--> statement-breakpoint
UPDATE
  articles
SET
  preview_interactions_show_on = COALESCE(preview_interactions_show_on_old, 'hover');

--> statement-breakpoint
ALTER TABLE
  articles DROP COLUMN preview_interactions_show_on_old;