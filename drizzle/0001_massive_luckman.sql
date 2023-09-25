PRAGMA foreign_keys = OFF;

--> statement-breakpoint
CREATE TABLE `articles_new` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `user_id` text NOT NULL,
  `slug` text NOT NULL,
  `title_translation_key` integer NOT NULL,
  `content_translation_key` integer NOT NULL,
  `published_at` integer,
  `preview_family` text,
  `preview_template_id` integer,
  `preview_interactions_show_on` text,
  `preview_prop_1` text,
  `preview_prop_2` text,
  `preview_translation_key_1` integer NOT NULL,
  `preview_translation_key_2` integer NOT NULL,
  `preview_image_id_1` integer NOT NULL,
  `preview_image_id_2` integer NOT NULL,
  `url_preview_image_id` integer,
  FOREIGN KEY (`user_id`) REFERENCES `auth_user`(`id`) ON UPDATE cascade ON DELETE cascade,
  FOREIGN KEY (`title_translation_key`) REFERENCES `translations`(`key`) ON UPDATE cascade ON DELETE cascade,
  FOREIGN KEY (`content_translation_key`) REFERENCES `translations`(`key`) ON UPDATE cascade ON DELETE cascade,
  FOREIGN KEY (`preview_template_id`) REFERENCES `preview_templates`(`id`) ON UPDATE cascade ON DELETE
  set
    null,
    FOREIGN KEY (`preview_translation_key_1`) REFERENCES `translations`(`key`) ON UPDATE cascade ON DELETE
  set
    null,
    FOREIGN KEY (`preview_translation_key_2`) REFERENCES `translations`(`key`) ON UPDATE cascade ON DELETE
  set
    null,
    FOREIGN KEY (`preview_image_id_1`) REFERENCES `images`(`id`) ON UPDATE cascade ON DELETE
  set
    null,
    FOREIGN KEY (`preview_image_id_2`) REFERENCES `images`(`id`) ON UPDATE cascade ON DELETE
  set
    null,
    FOREIGN KEY (`url_preview_image_id`) REFERENCES `images`(`id`) ON UPDATE cascade ON DELETE
  set
    null
);

--> statement-breakpoint
INSERT INTO
  articles_new
SELECT
  *,
  null
FROM
  articles;

--> statement-breakpoint
DROP TABLE articles;

--> statement-breakpoint
ALTER TABLE
  articles_new RENAME TO articles;

--> statement-breakpoint
PRAGMA foreign_keys = ON;