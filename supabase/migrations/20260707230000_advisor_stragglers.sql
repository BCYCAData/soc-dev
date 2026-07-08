-- C5 follow-up: two stragglers.
-- 1. The survey_responses SELECT policy kept a bare auth.email() (the C5 sweep
--    only handled the wrapped form of auth.email()).
ALTER POLICY "Enable SELECT for users based on email" ON public.survey_responses
  USING ((( SELECT auth.email())) = email_address);

-- 2. private."x_get_property_for_authenticated_user()" — the retired helper's
--    name literally includes the parentheses, so the search_path sweep (public
--    schema only) and a plain ALTER both missed it.
ALTER FUNCTION private."x_get_property_for_authenticated_user()"() SET search_path = public, extensions;
