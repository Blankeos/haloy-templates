FROM postgres:17-alpine@sha256:18cfe3ef5e6815560c98237d6216d1e5119702fb0f3894c8785dd58b8bbe5d73
CMD ["sh","-c","exec /bin/sh -ec \"psql -v org_id=\\\"${FIRECRAWL_ORG_ID}\\\" -v team_id=\\\"${FIRECRAWL_TEAM_ID}\\\" -v api_key=\\\"${FIRECRAWL_API_KEY}\\\" -f /seed.sql\""]
