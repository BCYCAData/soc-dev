-- Enable the Postgres extensions the baseline schema depends on.
-- Must run BEFORE 20260613120001_remote_schema.sql, which references
-- extensions.geometry (PostGIS), uuid_generate_v4 (uuid-ossp), gen_random_uuid,
-- and net.http_get (pg_net) inside table defaults and function bodies.
--
-- Supabase convention: install extensions into the dedicated "extensions" schema
-- (kept out of the public search_path). These match the dev project
-- (swyytxokzdqqitszxaep) as of 2026-06-13: postgis 3.3.7, uuid-ossp 1.1,
-- pgcrypto 1.3, pg_net 0.19.5.

create schema if not exists extensions;

create extension if not exists "uuid-ossp" with schema extensions;
create extension if not exists "pgcrypto"  with schema extensions;
create extension if not exists "postgis"   with schema extensions;
create extension if not exists "pg_net"    with schema extensions;
