CREATE POLICY "Anyone can delete messages"
ON public.chat_messages
FOR DELETE
TO public
USING (true);