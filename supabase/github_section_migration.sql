-- Add an optional public GitHub contribution section to the homepage.

alter table sections drop constraint if exists sections_kind_check;
alter table sections add constraint sections_kind_check
  check (kind in ('about', 'experience', 'skills', 'projects', 'github', 'contact', 'custom'));

do $$
declare
  github_order int;
  contact_order int;
begin
  if not exists (select 1 from sections where kind = 'github') then
    select sort_order into contact_order from sections where kind = 'contact' limit 1;

    if contact_order is null then
      select coalesce(max(sort_order), -1) + 1 into github_order from sections;
    else
      github_order := contact_order;
      update sections set sort_order = sort_order + 1 where sort_order >= contact_order;
    end if;

    insert into sections (kind, label, heading, sort_order, visible)
    values ('github', 'GitHub', 'Open-source activity', github_order, true);
  end if;
end $$;
