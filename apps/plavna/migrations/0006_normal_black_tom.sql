ALTER TABLE `pages` ADD `color_theme` text DEFAULT 'milk' NOT NULL;--> statement-breakpoint
ALTER TABLE `pages` ADD `style_theme` text DEFAULT 'modern' NOT NULL;--> statement-breakpoint
ALTER TABLE `pages` ADD `typography_theme` text DEFAULT 'inter' NOT NULL;--> statement-breakpoint
CREATE INDEX `idx_sections_page_id` ON `sections` (`page_id`);