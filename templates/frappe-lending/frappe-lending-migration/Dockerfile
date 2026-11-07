FROM ${IMAGE_NAME:-frappe/erpnext}:${VERSION:-v15}
EXPOSE 8080
ENTRYPOINT ["bash","-c"]
CMD ["curl -f http://frappe.lending:8080/api/method/ping || echo \"Site busy\" && exit 0; bench --site all set-config -p maintenance_mode 1; bench --site all set-config -p pause_scheduler 1; bench --site all migrate; bench --site all set-config -p maintenance_mode 0; bench --site all set-config -p pause_scheduler 0;\n"]
