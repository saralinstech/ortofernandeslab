ALTER TABLE `staff` ADD `must_change_password` integer DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE `staff` ADD `password_changed_at` text;