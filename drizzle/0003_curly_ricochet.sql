CREATE TABLE `admin_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`staff_id` integer NOT NULL,
	`expires_at` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
ALTER TABLE `staff` ADD `password_hash` text DEFAULT '' NOT NULL;