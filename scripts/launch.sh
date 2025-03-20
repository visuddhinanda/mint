#!/bin/bash

set -e

export USAGE="USAGE: $0 setup"

if [ "$#" -ne 1 ]; then
    echo $USAGE
    exit 1
fi

export WORK_DIR="/srv"

if [ "$1" == "fpm" ]; then
    echo "start fpm worker"
    # TODO
elif [ "$1" == "setup" ]; then
    cd $WORK_DIR/api-v8/
    composer install --optimize-autoloader --no-dev
    npm install
    cd $WORK_DIR/api-v8/public/
    composer install --optimize-autoloader --no-dev
    npm install
elif [ "$1" == "db-migrate" ]; then
    echo "migrate database"
    # TODO
else
    echo $USAGE
    exit 1
fi
