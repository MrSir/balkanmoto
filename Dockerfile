FROM ubuntu:26.10

RUN apt-get clean  \
    && apt-get autoremove  \
    && apt-get update  \
    && apt-get -y install bash vim curl nginx php php-fpm

COPY ./site.conf /etc/nginx/sites-enabled/default

ENTRYPOINT service php8.5-fpm start && service nginx start && /bin/bash
