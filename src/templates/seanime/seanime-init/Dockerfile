FROM busybox:1.37.0
CMD ["sh","-c","chown -R 1000:1000 /mnt/config && find /mnt/config -type d -exec chmod 755 {} + && find /mnt/config -type f -exec chmod 644 {} +"]
