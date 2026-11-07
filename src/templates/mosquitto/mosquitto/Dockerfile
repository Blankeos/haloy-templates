FROM eclipse-mosquitto:2.1.2-alpine
COPY mosquitto.conf /mosquitto/config/mosquitto.conf
ENTRYPOINT ["/bin/sh","-ec","umask 077\npassword_file=$(mktemp /mosquitto/data/passwordfile.XXXXXX)\ntrap 'rm -f \"$password_file\"' EXIT\nmosquitto_passwd -b -c - \"$MQTT_USERNAME\" \"$MQTT_PASSWORD\" > \"$password_file\"\nchown 1883:1883 \"$password_file\"\nchmod 600 \"$password_file\"\nmv -f \"$password_file\" /mosquitto/data/passwordfile\ntrap - EXIT\nexec /docker-entrypoint.sh /usr/sbin/mosquitto -c /mosquitto/config/mosquitto.conf\n"]
