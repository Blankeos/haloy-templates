FROM elasticsearch:7.14.2
CMD ["/bin/sh","-c","./bin/elasticsearch-plugin list | grep -q ingest-attachment || yes | ./bin/elasticsearch-plugin install --silent ingest-attachment;\n/usr/local/bin/docker-entrypoint.sh eswrapper"]
