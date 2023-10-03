PRAGMA foreign_keys = OFF;

--> statement-breakpoint
CREATE TABLE `images_new` (                                                                                       
        `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,                                                              
        `user_id` text NOT NULL,                                                                                      
        `source` text NOT NULL,                                                                                       
        `path` text,                                                                                                  
        `path_translation_key` integer,                                                                               
        FOREIGN KEY (`user_id`) REFERENCES `auth_user`(`id`) ON UPDATE cascade ON DELETE cascade,                     
        FOREIGN KEY (`path_translation_key`) REFERENCES `translations`(`key`) ON UPDATE cascade ON DELETE set null     
);        

--> statement-breakpoint
INSERT INTO
  images_new
SELECT
  *
FROM
  images;

--> statement-breakpoint
DROP TABLE images;

--> statement-breakpoint
ALTER TABLE
  images_new RENAME TO images;

--> statement-breakpoint
PRAGMA foreign_keys = ON;