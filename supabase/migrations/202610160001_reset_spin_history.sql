-- One-time operational reset requested before the event opens.
-- Delete network locks first because they restrict deletion of their attempts.
delete from private.game_ip_attempts;
delete from public.game_wins;
delete from public.game_attempts;
