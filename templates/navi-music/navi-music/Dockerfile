FROM ghcr.io/andre-carbajal/navimusic:4.3.0
ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar /app/NaviMusic.jar nogui --spring.profiles.active=prod; code=$?; if [ \"$code\" -eq 0 ]; then echo \"NaviMusic is idle. Set DISCORD_TOKEN and required YouTube credentials in the Environment tab, then redeploy.\"; tail -f /dev/null; fi; exit $code"]
