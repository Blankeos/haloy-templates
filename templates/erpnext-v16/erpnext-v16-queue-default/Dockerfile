FROM ${IMAGE_NAME:-docker.io/frappe/erpnext}:${VERSION:-version-16}
EXPOSE 8080
CMD ["bench","worker","--queue","default"]
