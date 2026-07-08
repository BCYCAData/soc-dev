-- D1: generic application error log, fed by the SvelteKit handleError hooks
-- (server + client). Mirrors the signin/signup_errors posture: INSERT-only for
-- app roles (errors can occur pre-auth), read via dashboard/service_role.
CREATE TABLE IF NOT EXISTS public.app_errors (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    occurred_at timestamptz NOT NULL DEFAULT now(),
    source text NOT NULL CHECK (source IN ('server', 'client')),
    status integer,
    message text NOT NULL,
    stack text,
    url text,
    user_id uuid,
    user_agent text,
    details jsonb NOT NULL DEFAULT '{}'::jsonb
);

ALTER TABLE public.app_errors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "insert_app_errors" ON public.app_errors
  FOR INSERT TO anon, authenticated WITH CHECK (true);

REVOKE ALL ON public.app_errors FROM anon, authenticated;
GRANT INSERT ON public.app_errors TO anon, authenticated;

CREATE INDEX IF NOT EXISTS idx_app_errors_occurred_at ON public.app_errors (occurred_at DESC);
