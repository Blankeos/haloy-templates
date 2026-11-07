# outline

Status: **partial**

- [partial] `outline-dex` bind-mount: bind mount ../files/etc/nginx/conf.d/default.conf is a file with no matching content in template.toml; dropped
- [partial] `outline-dex-server` bind-mount: bind mount ../files/etc/dex/config.yaml is a file with no matching content in template.toml; dropped
- [partial] `outline` internal-ref-to-public: outline is reached by hostname from another service but has a domain; with rolling deploys its container name changes
