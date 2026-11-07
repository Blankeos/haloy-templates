FROM hoppscotch/hoppscotch:latest
EXPOSE 8080
ENTRYPOINT ["/bin/sh","-c"]
CMD ["echo \"Running database migrations...\"\npnpm dlx prisma migrate deploy && echo \"Migration complete!\"\n"]
