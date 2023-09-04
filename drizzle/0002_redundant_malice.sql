ALTER TABLE
  `preview_types` RENAME TO `preview_templates`;

--> statement-breakpoint
ALTER TABLE
  `articles` RENAME TO `articles_old`;

--> statement-breakpoint
CREATE TABLE `articles` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `user_id` text NOT NULL,
  `slug` text NOT NULL,
  `title_translation_id` integer NOT NULL,
  `content_translation_id` integer NOT NULL,
  `published_at` integer,
  `preview_template_id` integer,
  `preview_interactions_show_on` text,
  `preview_prop_1_value` text,
  `preview_prop_2_value` text,
  `preview_prop_3_value` text,
  `preview_family` text,
  FOREIGN KEY (`user_id`) REFERENCES `auth_user`(`id`) ON UPDATE cascade ON DELETE cascade,
  FOREIGN KEY (`title_translation_id`) REFERENCES `translations`(`key`) ON UPDATE cascade ON DELETE cascade,
  FOREIGN KEY (`content_translation_id`) REFERENCES `translations`(`key`) ON UPDATE cascade ON DELETE cascade,
  FOREIGN KEY (`preview_template_id`) REFERENCES `preview_templates`(`id`) ON UPDATE
  set
    null ON DELETE
  set
    null
);

--> statement-breakpoint
INSERT INTO
  `articles`
SELECT
  `id`,
  `user_id`,
  `slug`,
  `title_translation_id`,
  `content_translation_id`,
  `published_at`,
  `preview_type_id`,
  `preview_interactions_show_on`,
  `preview_prop_1_value`,
  `preview_prop_2_value`,
  `preview_prop_3_value`,
  NULL
FROM
  `articles_old`;

--> statement-breakpoint
DROP TABLE `articles_old`;