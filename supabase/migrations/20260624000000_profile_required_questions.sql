-- Configurable personal-profile completion: the thin CONFIG table.
--
-- Records which personal-profile-form questions an admin has marked required and
-- in what order. The full catalog of answerable questions lives in code
-- (src/lib/profile/field-catalog.ts) because the field set is code-coupled to the
-- form and the get_profile_for_user payload; this table only stores the small,
-- admin-editable selection. Completion itself is computed in TypeScript
-- (src/lib/profile/completion.ts), so there is no SQL completion function here.
--
-- A present row means "configured"; `is_required = true` means it counts toward
-- completion. Absence of a row means the question is not required.
--
-- Seeded with first_name/family_name/mobile required, preserving the behaviour of
-- the prior hardcoded 3-field heuristic until an admin changes it.

create table if not exists public.profile_required_question (
  field_key   text primary key,
  is_required boolean not null default true,
  sort_order  integer not null default 0,
  updated_by  uuid references auth.users (id) on delete set null,
  updated_at  timestamptz not null default now()
);

comment on table public.profile_required_question is
  'Admin-configured set of personal-profile-form questions that count toward profile completion. Catalog of keys lives in code (field-catalog.ts).';

alter table public.profile_required_question enable row level security;

-- Any signed-in user may read the required set (needed to compute their own
-- completion). The data is non-sensitive configuration.
drop policy if exists "Authenticated can read profile requirements"
  on public.profile_required_question;
create policy "Authenticated can read profile requirements"
  on public.profile_required_question for select to authenticated
  using ( true );

-- Only admins (root admin role/permission OR the dedicated permission) may change
-- the configuration. Wrapped in scalar subqueries for auth_rls_initplan.
drop policy if exists "Admins can manage profile requirements"
  on public.profile_required_question;
create policy "Admins can manage profile requirements"
  on public.profile_required_question for all to authenticated
  using ( (select public.is_admin()) or (select public.has_permission('admin.site.profile-requirements')) )
  with check ( (select public.is_admin()) or (select public.has_permission('admin.site.profile-requirements')) );

grant select, insert, update, delete on public.profile_required_question to authenticated;
grant all on public.profile_required_question to service_role;

-- Preserve current behaviour: the three previously-hardcoded fields stay required.
insert into public.profile_required_question (field_key, is_required, sort_order) values
  ('first_name',  true, 1),
  ('family_name', true, 2),
  ('mobile',      true, 3)
on conflict (field_key) do nothing;

-- Some environments loaded role_permissions with explicit ids without advancing the
-- IDENTITY sequence (newprod had last_value=1 vs max(id)=38), so a plain insert
-- collides on the pkey before the ON CONFLICT (permission) is ever evaluated.
-- Advance the sequence to max(id) first. Idempotent and harmless where already correct.
select setval(
  pg_get_serial_sequence('public.role_permissions', 'id'),
  (select coalesce(max(id), 1) from public.role_permissions)
);

-- Make the new permission grantable to site admins. (The root 'admin' permission
-- already matches 'admin.site.profile-requirements' hierarchically via
-- has_permission, so existing full admins are unaffected.) role_permissions has a
-- UNIQUE (permission) constraint, so this is idempotent on re-run.
insert into public.role_permissions (role, permission)
values ('admin_site', 'admin.site.profile-requirements')
on conflict (permission) do nothing;
