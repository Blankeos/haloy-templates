FROM thingsboard/tb-node:4.3.1.1
CMD ["bash","-c","set -e\nif [ -f /data/.thingsboard-installed ]; then\n  echo \"ThingsBoard database already initialized.\"\n  exit 0\nfi\nINSTALL_TB=true LOAD_DEMO=${LOAD_DEMO:-false} start-tb-node.sh\ntouch /data/.thingsboard-installed\n"]
