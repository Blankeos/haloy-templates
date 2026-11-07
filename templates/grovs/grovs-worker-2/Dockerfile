FROM ghcr.io/grovs-io/backend:2.3.1
EXPOSE 8080
CMD ["bash","-c","bundle exec sidekiq -C config/sidekiq_maintenance.yml & bundle exec sidekiq -C config/sidekiq_device_updates.yml & wait -n"]
