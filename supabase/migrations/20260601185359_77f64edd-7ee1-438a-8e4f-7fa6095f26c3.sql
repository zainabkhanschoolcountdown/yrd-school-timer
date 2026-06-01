-- Helper functions (SECURITY DEFINER) for RLS
CREATE OR REPLACE FUNCTION public.current_username_lower()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT username_lower FROM public.profiles WHERE user_id = auth.uid()
$$;

CREATE OR REPLACE FUNCTION public.user_has_role(_role text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE username_lower = public.current_username_lower()
      AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.is_creator()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.current_username_lower() = 'mountfuji'
$$;

-- Lock down function execution
REVOKE EXECUTE ON FUNCTION public.current_username_lower() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.user_has_role(text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_creator() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.current_username_lower() TO authenticated;
GRANT EXECUTE ON FUNCTION public.user_has_role(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_creator() TO authenticated;

-- Fix touch_updated_at search_path
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Harden handle_new_user with username validation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uname TEXT;
BEGIN
  uname := COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1));
  IF lower(uname) !~ '^[a-z0-9_]{3,20}$' THEN
    RAISE EXCEPTION 'Invalid username format';
  END IF;
  INSERT INTO public.profiles (user_id, username, username_lower)
  VALUES (NEW.id, uname, lower(uname))
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- ============ chat_messages ============
ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS user_id uuid;

DROP POLICY IF EXISTS "Anyone can send messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Anyone can delete messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Anyone can read messages" ON public.chat_messages;

CREATE POLICY "Authenticated can read messages"
ON public.chat_messages FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated send as self, not banned"
ON public.chat_messages FOR INSERT TO authenticated
WITH CHECK (
  user_id = auth.uid()
  AND lower(author) = public.current_username_lower()
  AND NOT public.user_has_role('banned')
  AND char_length(text) BETWEEN 1 AND 500
);

CREATE POLICY "Author admin or creator can delete"
ON public.chat_messages FOR DELETE TO authenticated
USING (
  user_id = auth.uid()
  OR public.user_has_role('admin')
  OR public.is_creator()
);

REVOKE ALL ON public.chat_messages FROM anon;
GRANT SELECT, INSERT, DELETE ON public.chat_messages TO authenticated;
GRANT ALL ON public.chat_messages TO service_role;

-- ============ user_roles ============
DROP POLICY IF EXISTS "Anyone can add roles" ON public.user_roles;
DROP POLICY IF EXISTS "Anyone can remove roles" ON public.user_roles;
DROP POLICY IF EXISTS "Anyone can read roles" ON public.user_roles;

CREATE POLICY "Authenticated read roles"
ON public.user_roles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Creator manages admins, admins+creator manage bans"
ON public.user_roles FOR INSERT TO authenticated
WITH CHECK (
  (role = 'admin' AND public.is_creator())
  OR (role = 'banned' AND (public.is_creator() OR public.user_has_role('admin')))
);

CREATE POLICY "Creator removes admins, admins+creator remove bans"
ON public.user_roles FOR DELETE TO authenticated
USING (
  (role = 'admin' AND public.is_creator())
  OR (role = 'banned' AND (public.is_creator() OR public.user_has_role('admin')))
);

REVOKE ALL ON public.user_roles FROM anon;
GRANT SELECT, INSERT, DELETE ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

-- ============ widgets ============
DROP POLICY IF EXISTS "Anyone can add widgets" ON public.widgets;
DROP POLICY IF EXISTS "Anyone can remove widgets" ON public.widgets;
DROP POLICY IF EXISTS "Anyone can read widgets" ON public.widgets;

CREATE POLICY "Authenticated read widgets"
ON public.widgets FOR SELECT TO authenticated USING (true);

CREATE POLICY "Creator and admins add widgets"
ON public.widgets FOR INSERT TO authenticated
WITH CHECK (public.is_creator() OR public.user_has_role('admin'));

CREATE POLICY "Creator and admins remove widgets"
ON public.widgets FOR DELETE TO authenticated
USING (public.is_creator() OR public.user_has_role('admin'));

REVOKE ALL ON public.widgets FROM anon;
GRANT SELECT, INSERT, DELETE ON public.widgets TO authenticated;
GRANT ALL ON public.widgets TO service_role;

-- ============ profiles ============
ALTER TABLE public.profiles
  ADD CONSTRAINT username_format CHECK (username_lower ~ '^[a-z0-9_]{3,20}$') NOT VALID;

DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Authenticated view profiles"
ON public.profiles FOR SELECT TO authenticated USING (true);

REVOKE ALL ON public.profiles FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;