-- B5 (no_primary_key): the six single-row orphan tables (accidental SELECT...INTO
-- leftovers, confirmed unreferenced by any function/view/app code/typed client) are
-- being kept rather than dropped, so give each a surrogate identity primary key to
-- satisfy the advisor. Additive only; nothing inserts into these tables.
-- Idempotent guards so re-application is a no-op.

do $$
declare
  t text;
  tables text[] := array[
    'address_response','coordinates_kyng','geojson',
    'property_result','street_list','user_role'
  ];
begin
  foreach t in array tables loop
    if not exists (
      select 1 from pg_constraint
      where conrelid = ('public.'||t)::regclass and contype = 'p'
    ) then
      execute format(
        'alter table public.%I add column id bigint generated always as identity primary key',
        t
      );
    end if;
  end loop;
end $$;
