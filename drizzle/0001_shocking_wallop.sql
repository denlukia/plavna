ALTER TABLE preview_type ADD `url` text NOT NULL;--> statement-breakpoint
ALTER TABLE `preview_type` DROP COLUMN `component_reference`;
