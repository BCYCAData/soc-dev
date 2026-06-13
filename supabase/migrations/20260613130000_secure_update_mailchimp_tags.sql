-- Harden public.update_mailchimp_tags():
--   1. Read the Mailchimp API key from Supabase Vault instead of hardcoding it
--      (the baseline dump shipped the key inline; it is now redacted in VC and
--      the real value lives only in vault.secrets, seeded per-environment).
--   2. Pin a safe search_path and fully-qualify all objects (it is SECURITY
--      DEFINER, so a mutable search_path is an injection risk).
--   3. Tighten EXECUTE: this performs an outbound Mailchimp write and is only
--      ever invoked server-side, so revoke it from anon/authenticated/qgis_reader
--      and grant it to service_role only.
--
-- NOTE: the Vault secret named 'mailchimp_api_key' must exist for this function
-- to work at runtime. It is seeded out-of-band per environment (NOT in this
-- migration, so a fresh rebuild stays secret-free). If the secret is absent the
-- function raises a clear error rather than silently calling Mailchimp unauthenticated.

create or replace function public.update_mailchimp_tags(email_address text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_api_key       text;
  v_server_prefix text := 'us20';
  v_list_id       text := 'f2eeb1ee80';   -- Mailchimp audience id (not a secret)
  v_md5_hash      text;
  v_response      json;
begin
  select decrypted_secret into v_api_key
  from vault.decrypted_secrets
  where name = 'mailchimp_api_key';

  if v_api_key is null then
    raise exception 'Mailchimp API key not configured: add a Vault secret named ''mailchimp_api_key''';
  end if;

  v_md5_hash := pg_catalog.md5(email_address);

  -- PUT upserts the member, so it doubles as an existence check.
  select content::json into v_response
  from extensions.http((
    'PUT',
    pg_catalog.format('https://%s.api.mailchimp.com/3.0/lists/%s/members/%s',
                      v_server_prefix, v_list_id, v_md5_hash),
    array[ extensions.http_header('Authorization', pg_catalog.format('Basic %s', v_api_key)) ],
    'application/json',
    pg_catalog.json_build_object(
      'email_address',         email_address,
      'status_if_new',         'subscribed',
      'skip_merge_validation', true,
      'tags',                  pg_catalog.json_build_array('SOC')
    )::text
  )::extensions.http_request);
end;
$$;

-- Least-privilege: server-side only.
revoke all on function public.update_mailchimp_tags(text) from public;
revoke all on function public.update_mailchimp_tags(text) from anon;
revoke all on function public.update_mailchimp_tags(text) from authenticated;
revoke all on function public.update_mailchimp_tags(text) from qgis_reader;
grant execute on function public.update_mailchimp_tags(text) to service_role;
