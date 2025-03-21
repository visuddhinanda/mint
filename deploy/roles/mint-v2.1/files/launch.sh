#!/bin/bash

set -e

export USAGE="USAGE: $0 COMMAND"

if [ "$#" -lt 1 ]; then
    echo $USAGE
    exit 1
fi

export WORK_DIR="/srv"

export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"

if [ "$1" == "setup" ]; then
    cd $WORK_DIR/api-v8/
    echo "install v2 laravel vendors"
    composer update --optimize-autoloader --no-dev
    echo "install v2 nodejs packages"
    npm install --production

    cd $WORK_DIR/api-v8/public/
    echo "install v1 vendors"
    composer update --optimize-autoloader --no-dev
    echo "install v1 nodejs packages"
    npm install --production

    echo "check file permissions"
    cd $WORK_DIR/
    chown -R www-data:www-data bootstrap/cache storage

    cd $WORK_DIR/
    echo "caching configuration "
    su -c php artisan config:cache www-data
    echo "caching events"
    su -c php artisan event:cache www-data
    echo "caching "
    su -c php artisan www-data
    echo "caching routes"
    su -c php artisan route:cache www-data
    echo "caching views"
    su -c php artisan view:cache www-data
else
    $@
fi

exit 0
