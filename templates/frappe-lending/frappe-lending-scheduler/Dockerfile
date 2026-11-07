FROM ${IMAGE_NAME:-frappe/erpnext}:${VERSION:-v15}
ENTRYPOINT ["bash","-c"]
CMD ["cd /home/frappe/frappe-bench; export start=`date +%s`; while [ ! -d \"apps/lending\" ]; do\n  echo \"Waiting for apps to be available...\";\n  sleep 2;\n  if (( `date +%s`-start > 300 )); then\n    echo \"Timeout waiting for apps\";\n    break;\n  fi;\ndone; if [ -d \"apps/lending\" ] && ! ./env/bin/pip show lending > /dev/null 2>&1; then\n  echo \"Installing lending app in Python environment...\";\n  ./env/bin/pip install -e apps/lending || echo \"Failed to install lending\";\nfi; exec bench schedule\n"]
