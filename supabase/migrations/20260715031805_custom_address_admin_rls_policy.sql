-- Replace the placeholder temp_permissive RLS policy on public.custom_address with
-- a real permission-scoped policy, matching the project's admin_manage_* / jwt_can
-- convention (same admin.site.data.addresses permission used by the addresses admin
-- route and the address_validation_errors read policy).
--
-- RLS is already enabled on the table in the baseline schema. FOR ALL with USING and
-- no explicit WITH CHECK means WITH CHECK inherits the USING expression, so writes
-- are gated by the same admin check.
--
-- Safe wrt user-facing flows: signup and my-property read custom_address only via
-- public.get_addresspoint_from_address, which is SECURITY DEFINER (owner postgres)
-- and therefore bypasses RLS. The only invoker-rights reader is
-- get_validated_addresspoint_from_address, called solely from the permission-gated
-- admin addresses route.

drop policy if exists "temp_permissive" on public.custom_address;

create policy "admin_manage_custom_address"
    on public.custom_address
    for all
    to public
    using ( (select public.jwt_can('admin.site.data.addresses'::text)) );
