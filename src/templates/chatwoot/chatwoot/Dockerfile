FROM chatwoot/chatwoot:v4.12.1
ENTRYPOINT ["sh","-c","docker/entrypoints/rails.sh"]
CMD ["sh","-c","bundle exec rails db:chatwoot_prepare && bundle exec rails s -p 3000 -b 0.0.0.0"]
