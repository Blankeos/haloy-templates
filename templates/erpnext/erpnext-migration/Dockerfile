FROM ${IMAGE_NAME:-docker.io/frappe/erpnext}:${VERSION:-version-15}
ENTRYPOINT ["bash","-c"]
CMD ["curl -f http://app.example.com:8080/api/method/ping || echo \"Site busy\" && exit 0; bench --site all set-config -p maintenance_mode 1; bench --site all set-config -p pause_scheduler 1; bench --site all migrate; bench --site all set-config -p maintenance_mode 0; bench --site all set-config -p pause_scheduler 0;\n"]
