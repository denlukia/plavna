ALTER TABLE `articles` RENAME COLUMN `preview_prop_1_value` TO `preview_prop_1`;--> statement-breakpoint
ALTER TABLE `articles` RENAME COLUMN `preview_prop_2_value` TO `preview_prop_2`;--> statement-breakpoint
ALTER TABLE `articles` DROP COLUMN `preview_prop_3_value`;