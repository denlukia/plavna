ALTER TABLE `pages` RENAME COLUMN "typography_theme" TO "typography_functional_theme";--> statement-breakpoint
ALTER TABLE `pages` ADD `typography_aesthetic_theme` text DEFAULT 'inter' NOT NULL;