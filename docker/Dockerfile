FROM ubuntu:18.04

RUN export DEBIAN_FRONTEND=noninteractive

RUN apt-get -y update && apt-get -y upgrade

# handle timezone config
ENV TZ=America/Chicago
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# create container user
RUN groupadd -r docker
RUN useradd -r -d /home/docker -g docker docker

# install php
RUN apt-get -y install curl git zip unzip
RUN apt-get -y install php7.2-fpm php7.2-sqlite3

# install composer
RUN curl -o /tmp/composer-setup.php https://getcomposer.org/installer \
 && curl -o /tmp/composer-setup.sig https://composer.github.io/installer.sig \
 && php -r "if (hash('SHA384', file_get_contents('/tmp/composer-setup.php')) !== trim(file_get_contents('/tmp/composer-setup.sig'))) { unlink('/tmp/composer-setup.php'); echo 'Invalid installer' . PHP_EOL; exit(1); }" \
 && php /tmp/composer-setup.php --no-ansi --install-dir=/usr/local/bin --filename=composer --snapshot \
 && rm -f /tmp/composer-setup.*

# install node & npm
RUN apt-get -y install nodejs npm

# install bower & grunt
RUN npm install -g bower \
 && npm install -g grunt-cli

# setup path for codebase
RUN mkdir -p /home/docker/code
RUN chown -R docker:docker /home/docker
