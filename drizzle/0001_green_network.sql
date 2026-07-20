ALTER TABLE `products` ADD `description` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `image_url` text;--> statement-breakpoint
ALTER TABLE `products` ADD `featured` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `public_visible` integer DEFAULT true NOT NULL;