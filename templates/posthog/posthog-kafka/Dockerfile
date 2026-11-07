FROM docker.io/redpandadata/redpanda:v25.1.9
EXPOSE 8080
CMD ["redpanda","start","--kafka-addr internal://0.0.0.0:9092","--advertise-kafka-addr internal://posthog-kafka:9092","--rpc-addr posthog-kafka:33145","--advertise-rpc-addr posthog-kafka:33145","--mode dev-container","--smp 1","--memory 1G","--reserve-memory 0M","--overprovisioned","--set redpanda.empty_seed_starts_cluster=false","--seeds posthog-kafka:33145","--set redpanda.auto_create_topics_enabled=true"]
