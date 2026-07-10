-- Phase 2 (admin Roles UI): make public.role_permissions one-row-per-role — the shape the
-- admin permissions page, the user_roles materialization trigger, and check_admin_permission
-- all already assume.
--
-- The table only enforced UNIQUE(permission), NOT UNIQUE(role), so a role could span
-- multiple rows. admin_site did: the profile-requirements migration (20260624000000) added
-- 'admin.site.profile-requirements' as a SECOND admin_site row (via ON CONFLICT (permission)).
-- Because the materialization trigger unions every row for a role, consolidating is a no-op
-- for effective permissions — it only unblocks the edit UI, whose UPDATE ... WHERE role = X
-- would otherwise set both rows to the same string and violate UNIQUE(permission).

-- 1. Drop the UNIQUE(permission) constraint: it blocked two roles from sharing a bundle and
--    forced the split-row workaround. Replaced by UNIQUE(role) below.
alter table public.role_permissions drop constraint if exists role_permissions_permission_key;

-- 2. Consolidate to one row per role: rewrite the lowest-id row for each role to the
--    de-duplicated, sorted union of all that role's tokens, then delete the extra rows.
update public.role_permissions rp
set permission = m.permission
from (
	select role,
		string_agg(distinct btrim(token), ',' order by btrim(token)) as permission
	from public.role_permissions,
		lateral unnest(string_to_array(permission, ',')) as token
	where btrim(token) <> ''
	group by role
) m
where rp.role = m.role
	and rp.id = (select min(id) from public.role_permissions rp2 where rp2.role = rp.role);

delete from public.role_permissions rp
where rp.id <> (select min(id) from public.role_permissions rp2 where rp2.role = rp.role);

-- 3. Enforce the one-row-per-role invariant so it cannot regress.
alter table public.role_permissions add constraint role_permissions_role_key unique (role);

-- 4. add_role_to_enum self-guards on auth.uid() holding admin.site.roles, so it must be
--    called by the signed-in admin — a service-role client (auth.uid() null) would fail its
--    own check. b4b (20260707222000) misclassified it as internal-only and revoked
--    authenticated; restore it. The in-function admin check is the real gate.
grant execute on function public.add_role_to_enum(text) to authenticated;
