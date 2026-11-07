FROM supabase/supavisor:2.5.1
CMD ["/bin/sh","-c","/app/bin/migrate && /app/bin/supavisor eval \"$(cat /etc/pooler/pooler.exs)\" && /app/bin/server"]
