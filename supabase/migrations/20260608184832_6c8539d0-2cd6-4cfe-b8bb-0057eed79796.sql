CREATE TABLE public.game_recommendations (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    game_name text NOT NULL,
    game_url text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT game_name_length CHECK (char_length(game_name) >= 1 AND char_length(game_name) <= 100),
    CONSTRAINT game_url_length CHECK (game_url IS NULL OR char_length(game_url) <= 500)
);

GRANT SELECT, INSERT ON public.game_recommendations TO authenticated;
GRANT ALL ON public.game_recommendations TO service_role;

ALTER TABLE public.game_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can submit recommendations"
ON public.game_recommendations
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Creator and admins can view recommendations"
ON public.game_recommendations
FOR SELECT
TO authenticated
USING (is_creator() OR user_has_role('admin'::text));