FROM ghcr.io/aientech/dossier:v1.9.0
CMD ["sh","-c","if [ -z \"$DOSSIER_PASSWORD\" ]; then\n  [ -n \"$DOSSIER_ADMIN_PASSWORD\" ] || { echo \"Set DOSSIER_ADMIN_PASSWORD or DOSSIER_PASSWORD\" >&2; exit 1; }\n  DOSSIER_PASSWORD=\"$(printf '%s\\n' \"$DOSSIER_ADMIN_PASSWORD\" | hash-password)\"\n  export DOSSIER_PASSWORD\nfi\nunset DOSSIER_ADMIN_PASSWORD\nexec ./start.sh\n"]
