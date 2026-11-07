# container-monitoring

Status: **manual**
Badge: ✅ verified (haloy v0.1.0-beta.73, 2026-11-07)

- [manual] `container-monitoring-cadvisor` unsupported-privileged: privileged mode has no Haloy equivalent
- [manual] `container-monitoring-cadvisor` unsupported-devices: device passthrough has no Haloy equivalent
- [partial] `container-monitoring-cadvisor` host-path: host path / mounted as-is; make sure it exists on the server
- [partial] `container-monitoring-cadvisor` host-path: host path /var/run mounted as-is; make sure it exists on the server
- [partial] `container-monitoring-cadvisor` host-path: host path /sys mounted as-is; make sure it exists on the server
- [partial] `container-monitoring-cadvisor` host-path: host path /var/lib/docker/ mounted as-is; make sure it exists on the server
- [partial] `container-monitoring-cadvisor` host-path: host path /dev/disk/ mounted as-is; make sure it exists on the server
- [manual] `container-monitoring-node-exporter` unsupported-pid: host pid namespace has no Haloy equivalent
- [partial] `container-monitoring-node-exporter` host-path: host path / mounted as-is; make sure it exists on the server
- [partial] `container-monitoring-prometheus` bind-mount: bind mount ../files/prometheus.yml is a file with no matching content in template.toml; dropped
- [partial] `container-monitoring-grafana` bind-mount: bind mount ../files/grafana/datasources.yml is a file with no matching content in template.toml; dropped
- [partial] `container-monitoring-grafana` bind-mount: bind mount ../files/grafana/dashboards.yml is a file with no matching content in template.toml; dropped
- [partial] `container-monitoring-grafana` bind-mount: bind mount ../files/grafana/cluster-overview.json is a file with no matching content in template.toml; dropped
- [partial] `container-monitoring-grafana` bind-mount: bind mount ../files/grafana/container-detail.json is a file with no matching content in template.toml; dropped
