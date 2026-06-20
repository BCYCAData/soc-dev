-- Restore public.get_enum_values(text[]).
--
-- Context: this function exists on new-prod (as SECURITY DEFINER with a mutable
-- search_path) but was missing on dev, which caused /admin/site/data/spatial to
-- return 500 — its load calls `supabase.rpc('get_enum_values', { enum_names: [...] })`
-- and the missing function set `enumError`, tripping `throw error(500, ...)`.
--
-- Recreated here hardened: SECURITY INVOKER + pinned `search_path` (it only reads
-- pg_catalog, so invoker rights are sufficient and it avoids the
-- function_search_path_mutable / definer-executable advisor findings). When this
-- migration is applied to new-prod at cutover, it also upgrades that copy.

create or replace function public.get_enum_values(enum_names text[])
returns jsonb
language plpgsql
stable
security invoker
set search_path = ''
as $$
declare
  result jsonb := '{}'::jsonb;
  enum_name text;
begin
  foreach enum_name in array enum_names loop
    result := result || jsonb_build_object(
      enum_name,
      (select jsonb_agg(e.enumlabel order by e.enumsortorder)
         from pg_catalog.pg_enum e
         join pg_catalog.pg_type t on t.oid = e.enumtypid
        where t.typname = enum_name)
    );
  end loop;
  return result;
end;
$$;
