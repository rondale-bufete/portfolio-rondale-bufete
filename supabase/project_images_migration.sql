-- Add ordered showcase images to projects.
-- Existing image_url values remain supported by the application as a fallback.
alter table projects
add column if not exists image_urls text[] not null default '{}';

update projects
set image_urls = array[image_url]
where image_url <> ''
  and cardinality(image_urls) = 0;
