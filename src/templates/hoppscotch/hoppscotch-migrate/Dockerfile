FROM hoppscotch/hoppscotch:latest
ENTRYPOINT ["/bin/sh","-c"]
CMD ["echo \"Running database migrations...\"\npnpm dlx prisma migrate deploy && echo \"Migration complete!\"\n"]
