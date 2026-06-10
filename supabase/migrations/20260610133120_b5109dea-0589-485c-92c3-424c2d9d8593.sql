
-- device_fingerprints: which user has used which browser fingerprint
CREATE TABLE public.device_fingerprints (
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  fingerprint text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, fingerprint)
);

GRANT SELECT, INSERT, UPDATE ON public.device_fingerprints TO authenticated;
GRANT ALL ON public.device_fingerprints TO service_role;

ALTER TABLE public.device_fingerprints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users insert own fingerprints"
  ON public.device_fingerprints FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "users update own fingerprints"
  ON public.device_fingerprints FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "users read own; admins read all"
  ON public.device_fingerprints FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.user_has_role('admin') OR public.is_creator());

-- banned_devices: fingerprints blocked from the site
CREATE TABLE public.banned_devices (
  fingerprint text PRIMARY KEY,
  banned_by text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.banned_devices TO anon, authenticated;
GRANT ALL ON public.banned_devices TO service_role;

ALTER TABLE public.banned_devices ENABLE ROW LEVEL SECURITY;

-- Allow anyone (incl. anon) to check whether a fingerprint is banned.
-- The table only contains opaque hashes; not sensitive.
CREATE POLICY "anyone can read banned devices"
  ON public.banned_devices FOR SELECT
  USING (true);

CREATE POLICY "admins can insert banned devices"
  ON public.banned_devices FOR INSERT TO authenticated
  WITH CHECK (public.user_has_role('admin') OR public.is_creator());

CREATE POLICY "admins can delete banned devices"
  ON public.banned_devices FOR DELETE TO authenticated
  USING (public.user_has_role('admin') OR public.is_creator());

-- Helper: ban every fingerprint ever seen for a given username.
CREATE OR REPLACE FUNCTION public.ban_user_devices(_username text)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid;
  inserted integer := 0;
  caller_name text;
BEGIN
  IF NOT (public.user_has_role('admin') OR public.is_creator()) THEN
    RAISE EXCEPTION 'not authorized';
  END IF;

  SELECT user_id INTO uid FROM public.profiles WHERE username_lower = lower(_username);
  IF uid IS NULL THEN RETURN 0; END IF;

  SELECT username_lower INTO caller_name FROM public.profiles WHERE user_id = auth.uid();

  WITH ins AS (
    INSERT INTO public.banned_devices (fingerprint, banned_by)
    SELECT fingerprint, caller_name FROM public.device_fingerprints WHERE user_id = uid
    ON CONFLICT (fingerprint) DO NOTHING
    RETURNING 1
  )
  SELECT count(*) INTO inserted FROM ins;

  RETURN inserted;
END;
$$;

GRANT EXECUTE ON FUNCTION public.ban_user_devices(text) TO authenticated;
