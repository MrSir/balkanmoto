#!/bin/bash

# shits and giggles #
alias fucking=sudo

apt-get update
apt-get -y install python-software-properties

#curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -

# add needed repos and update #
add-apt-repository -y ppa:ondrej/php
add-apt-repository -y ppa:ondrej/mysql-5.6
apt-get update

# basic tools #
apt-get -y install vim curl nginx sqlite

# install php and enable it should be v7.2#
apt-get -y install php7.2 php7.2-fpm php-curl php-gd php-imap php-xml php-mbstring php-zip php-soap php7.2-bcmath
phpenmod gd
phpenmod imap

# configure php upload file size to something more usable
sed -i "s/upload_max_filesize = 2M/upload_max_filesize = 128M/" /etc/php/7.2/fpm/php.ini
sed -i "s/upload_max_filesize = 2M/upload_max_filesize = 128M/" /etc/php/7.2/cli/php.ini
sed -i "s/post_max_size = 8M/post_max_size = 128M/" /etc/php/7.2/fpm/php.ini
sed -i "s/post_max_size = 8M/post_max_size = 128M/" /etc/php/7.2/cli/php.ini
sed -i "s/group = www-data/group = vagrant/" /etc/php/7.2/fpm/pool.d/www.conf

service php7.2-fpm restart
service nginx restart

apt-get -y install redis-server

# install mysql-server #
debconf-set-selections <<< 'mysql-server mysql-server/root_password password Test1234'
debconf-set-selections <<< 'mysql-server mysql-server/root_password_again password Test1234'
apt-get -y install mysql-server-5.6 php-mysql

# add root user to specific IP to differentiate between vagrant boxes #
mysql -uroot -pTest1234 -e "CREATE USER 'root'@'%' IDENTIFIED BY 'Test1234'; GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;"

# create dbs #
mysql -uroot -pTest1234 -e "CREATE DATABASE balkanmoto CHARSET utf8 COLLATE utf8_unicode_ci;"
mysql -uroot -pTest1234 -e "CREATE DATABASE balkanmoto_test CHARSET utf8 COLLATE utf8_unicode_ci;"

# add permissions to root for tables #
mysql -uroot -pTest1234 -e "GRANT ALL PRIVILEGES ON balkanmoto.* TO 'root'@'localhost';"
mysql -uroot -pTest1234 -e "GRANT ALL PRIVILEGES ON balkanmoto_test.* TO 'root'@'localhost';"

# change mysql config  #
sed -i "s/bind-address.*/bind-address = 0.0.0.0/" /etc/mysql/mysql.conf.d/mysqld.cnf
sed -i "s/max_allowed_packet.*/max_allowed_packet = 128M/" /etc/mysql/mysql.conf.d/mysqld.cnf


# restart mysql #
service mysql restart

# install composer globally #
curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer

composer global require hirak/prestissimo

# install git #
apt-get -y install git

apt-get autoclean

# site config copy
cp /var/www/site.conf /etc/nginx/sites-enabled/balkanmoto.com.conf

service nginx restart

chmod 755 /var/www/phpunit.sh

nginx -v
php -v
mysql -V