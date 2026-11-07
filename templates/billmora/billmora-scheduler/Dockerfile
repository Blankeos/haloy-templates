FROM ghcr.io/billmora/billmora:latest
CMD ["/bin/sh","-c","while true; do php artisan schedule:run >> /dev/null 2>&1; sleep 60; done"]
