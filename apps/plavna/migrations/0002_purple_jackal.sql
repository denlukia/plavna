-- Step 1: Add the new column with a temporary name
ALTER TABLE
  articles
ADD
  COLUMN description_translation_key_temp INTEGER;

--> statement-breakpoint
-- Step 2: Create empty translations records
INSERT INTO
  translations (user_id)
SELECT
  (user_id)
FROM
  articles;

--> statement-breakpoint
-- Step 3: Update the articles with the new translation keys
WITH translation_keys_non_zeroed AS (
  SELECT
    `key`
  FROM
    translations
  LIMIT
    (
      SELECT
        COUNT(*)
      FROM
        articles
    ) OFFSET (
      SELECT
        COUNT(*)
      FROM
        translations
    ) - (
      SELECT
        COUNT(*)
      FROM
        articles
    )
),
translation_keys AS (
  SELECT
    `key`,
    ROW_NUMBER() OVER () AS `rn`
  FROM
    translation_keys_non_zeroed
),
article_rows AS (
  SELECT
    `id`,
    ROW_NUMBER() OVER () AS `rn`
  FROM
    articles
)
UPDATE
  articles
SET
  description_translation_key_temp = (
    SELECT
      `key`
    FROM
      translation_keys,
      article_rows
    WHERE
      translation_keys.rn = article_rows.rn
      AND article_rows.rn = (
        SELECT
          article_rows.rn
        FROM
          article_rows
        WHERE
          articles.ROWID = article_rows.rn
      )
  );

--> statement-breakpoint
-- Step 4: Create a new table with the desired structure
CREATE TABLE `articles_new` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `user_id` text NOT NULL,
  `slug` text NOT NULL,
  `title_translation_key` integer NOT NULL,
  `content_translation_key` integer NOT NULL,
  `publish_time` integer,
  `likes_count` integer DEFAULT 0 NOT NULL,
  `preview_columns` integer DEFAULT 1 NOT NULL,
  `preview_rows` integer DEFAULT 1 NOT NULL,
  `preview_family` text,
  `preview_template_id` integer,
  `preview_prop_1` text,
  `preview_prop_2` text,
  `preview_translation_1_key` integer NOT NULL,
  `preview_translation_2_key` integer NOT NULL,
  `preview_image_1_id` integer NOT NULL,
  `preview_image_2_id` integer NOT NULL,
  `preview_create_localized_screenshots` integer DEFAULT false NOT NULL,
  `preview_screenshot_image_id` integer,
  `preview_interactions_show_on` TEXT DEFAULT 'hover' NOT NULL,
  `description_translation_key` INTEGER NOT NULL,
  FOREIGN KEY (`user_id`) REFERENCES `auth_user`(`id`) ON UPDATE cascade ON DELETE cascade,
  FOREIGN KEY (`title_translation_key`) REFERENCES `translations`(`key`) ON UPDATE cascade ON DELETE cascade,
  FOREIGN KEY (`content_translation_key`) REFERENCES `translations`(`key`) ON UPDATE cascade ON DELETE cascade,
  FOREIGN KEY (`preview_template_id`) REFERENCES `preview_templates`(`id`) ON UPDATE cascade ON DELETE
  set
    null,
    FOREIGN KEY (`preview_translation_1_key`) REFERENCES `translations`(`key`) ON UPDATE cascade ON DELETE
  set
    null,
    FOREIGN KEY (`preview_translation_2_key`) REFERENCES `translations`(`key`) ON UPDATE cascade ON DELETE
  set
    null,
    FOREIGN KEY (`preview_image_1_id`) REFERENCES `images`(`id`) ON UPDATE cascade ON DELETE
  set
    null,
    FOREIGN KEY (`preview_image_2_id`) REFERENCES `images`(`id`) ON UPDATE cascade ON DELETE
  set
    null,
    FOREIGN KEY (`preview_screenshot_image_id`) REFERENCES `images`(`id`) ON UPDATE cascade ON DELETE
  set
    null,
    FOREIGN KEY (`description_translation_key`) REFERENCES `translations`(`key`) ON UPDATE cascade ON DELETE
  set
    null
);

--> statement-breakpoint
-- Step 5: Copy data from the old table to the new table
INSERT INTO
  articles_new
SELECT
  *
FROM
  articles;

--> statement-breakpoint
-- Step 6: Drop the old table and rename the new table
DROP TABLE articles;

--> statement-breakpoint
ALTER TABLE
  articles_new RENAME TO articles;