FROM ${IMAGE_NAME:-docker.io/frappe/erpnext}:${VERSION:-version-16}
ENTRYPOINT ["bash","-c"]
CMD ["curl -f -H \"Host: app.example.com\" http://erpnext-v16-frontend:8080/api/method/ping || { echo \"Site not reachable yet, skipping migration\"; exit 0; }; bench --site all set-config -p maintenance_mode 1; bench --site all set-config -p pause_scheduler 1; bench --site all migrate; bench --site all set-config -p maintenance_mode 0; bench --site all set-config -p pause_scheduler 0;\n"]
