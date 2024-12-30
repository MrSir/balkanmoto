FROM ubuntu:24.10

RUN apt-get update && apt-get -y install bash vim curl nginx php php-fpm

COPY ./site.conf /etc/nginx/sites-enabled/default

ENTRYPOINT service php8.3-fpm start && service nginx start && /bin/bash
