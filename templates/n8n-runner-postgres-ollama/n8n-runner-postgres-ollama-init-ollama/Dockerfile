FROM ollama/ollama:latest
EXPOSE 8080
ENTRYPOINT ["/bin/sh"]
CMD ["-c","sleep 3; ollama pull llama3.2:latest; ollama pull gemma3:latest"]
