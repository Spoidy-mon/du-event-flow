-- Make created_by nullable to allow sample events
ALTER TABLE events ALTER COLUMN created_by DROP NOT NULL;