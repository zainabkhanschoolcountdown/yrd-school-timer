
CREATE TABLE public.user_roles (
  username_lower text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'banned')),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (username_lower, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read roles" ON public.user_roles FOR SELECT USING (true);
CREATE POLICY "Anyone can add roles" ON public.user_roles FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can remove roles" ON public.user_roles FOR DELETE USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.user_roles;

CREATE TABLE public.widgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  emoji text NOT NULL DEFAULT '⭐',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.widgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read widgets" ON public.widgets FOR SELECT USING (true);
CREATE POLICY "Anyone can add widgets" ON public.widgets FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can remove widgets" ON public.widgets FOR DELETE USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.widgets;
