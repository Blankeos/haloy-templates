FROM passbolt/passbolt:latest-ce
CMD ["/usr/bin/wait-for.sh","-t","0","passbolt-mariadb:3306","--","/docker-entrypoint.sh"]
