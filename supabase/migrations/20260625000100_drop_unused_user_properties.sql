-- Drop the orphan public.user_properties table.
--
-- It was a denormalised copy of the user<->property link held canonically in
-- public.user_property_profile_join. Its only consumer was
-- custom_access_token_hook, which was repointed at user_property_profile_join in
-- migration 20260625000000. Nothing else reads or writes it, and it had already
-- drifted out of sync, causing spurious 403s. CASCADE removes its RLS policies
-- (e.g. "Allow auth admin to read user_properties", "temp_permissive").

DROP TABLE IF EXISTS public.user_properties CASCADE;
