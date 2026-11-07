FROM ${IMAGE_NAME:-ghcr.io/frappe/lms}:${VERSION:-v2.52.0}
ENTRYPOINT ["bash","-c"]
CMD ["until [[ -f \"sites/app.example.com/.create-site-done\" ]]; do\n  echo \"Waiting for site app.example.com to be created (first boot takes a few minutes)\";\n  sleep 5;\ndone; exec /home/frappe/frappe-bench/env/bin/gunicorn --chdir=/home/frappe/frappe-bench/sites --bind=0.0.0.0:8000 --threads=4 --workers=2 --worker-class=gthread --worker-tmp-dir=/dev/shm --timeout=120 --preload frappe.app:application\n"]
