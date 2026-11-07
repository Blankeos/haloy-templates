FROM ghcr.io/grovs-io/backend:2.3.1
CMD ["bash","-c","bundle exec sidekiq -C config/sidekiq_scheduler.yml & bundle exec sidekiq -C config/sidekiq_worker.yml & bundle exec sidekiq -C config/sidekiq_batch.yml & wait -n"]
